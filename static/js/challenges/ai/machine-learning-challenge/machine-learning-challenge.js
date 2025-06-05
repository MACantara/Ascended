class AIChallenge {
    static trainingData = [];
    static model = null;
    static currentPhase = 'data-prep';

    static load(titleElement, contentElement) {
        titleElement.textContent = "AI Laboratory - Machine Learning";
        Hints.setChallenge('ai');
        this.generateTrainingData();
        this.render(contentElement);
    }

    static generateTrainingData() {
        this.trainingData = [
            { filename: 'photo.jpg', size: 2048, extension: 'jpg', type: 'image' },
            { filename: 'document.pdf', size: 512, extension: 'pdf', type: 'document' },
            { filename: 'music.mp3', size: 4096, extension: 'mp3', type: 'audio' },
            { filename: 'video.mp4', size: 8192, extension: 'mp4', type: 'video' },
            { filename: 'image.png', size: 1024, extension: 'png', type: 'image' },
            { filename: 'text.txt', size: 64, extension: 'txt', type: 'document' },
            { filename: 'song.wav', size: 6144, extension: 'wav', type: 'audio' },
            { filename: 'picture.gif', size: 512, extension: 'gif', type: 'image' },
            { filename: 'report.docx', size: 256, extension: 'docx', type: 'document' },
            { filename: 'clip.avi', size: 12288, extension: 'avi', type: 'video' }
        ];
    }

    static render(container) {
        container.innerHTML = `
            <div class="puzzle-container">
                <div class="flex mb-4">
                    <button onclick="AIChallenge.switchPhase('data-prep')" 
                            class="phase-tab mr-2 px-4 py-2 rounded ${this.currentPhase === 'data-prep' ? 'bg-purple-600' : 'bg-gray-600'}">
                        <i class="bi bi-database"></i> Data Preparation
                    </button>
                    <button onclick="AIChallenge.switchPhase('training')" 
                            class="phase-tab mr-2 px-4 py-2 rounded ${this.currentPhase === 'training' ? 'bg-purple-600' : 'bg-gray-600'}">
                        <i class="bi bi-gear"></i> Model Training
                    </button>
                    <button onclick="AIChallenge.switchPhase('testing')" 
                            class="phase-tab px-4 py-2 rounded ${this.currentPhase === 'testing' ? 'bg-purple-600' : 'bg-gray-600'}">
                        <i class="bi bi-check-square"></i> Testing
                    </button>
                </div>

                <div id="phase-content">
                    ${this.renderCurrentPhase()}
                </div>
            </div>
        `;
    }

    static renderCurrentPhase() {
        switch(this.currentPhase) {
            case 'data-prep':
                return this.renderDataPreparation();
            case 'training':
                return this.renderModelTraining();
            case 'testing':
                return this.renderModelTesting();
            default:
                return '';
        }
    }

    static renderDataPreparation() {
        return `
            <div>
                <h4 class="text-lg font-bold mb-2">Data Classification Task</h4>
                <p class="text-gray-300 mb-4">
                    Sort the files into their correct categories. This training data will teach the AI to classify file types.
                </p>

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                        <h5 class="font-bold mb-3">Unsorted Files</h5>
                        <div id="unsorted-files" class="bg-gray-800 border border-gray-600 rounded p-4 min-h-[200px]">
                            ${this.trainingData.map((file, index) => `
                                <div class="file-item bg-gray-700 p-2 rounded mb-2 cursor-move hover:bg-gray-600"
                                     draggable="true" data-file-index="${index}">
                                    <div class="flex items-center justify-between">
                                        <span class="font-mono text-sm">${file.filename}</span>
                                        <span class="text-xs text-gray-400">${file.size}KB</span>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <div>
                        <h5 class="font-bold mb-3">Categories</h5>
                        <div class="space-y-3">
                            ${['image', 'document', 'audio', 'video'].map(category => `
                                <div class="category-box bg-gray-800 border-2 border-dashed border-gray-600 rounded p-4 min-h-[80px]"
                                     data-category="${category}">
                                    <h6 class="font-bold mb-2 capitalize text-${this.getCategoryColor(category)}-400">
                                        <i class="bi bi-${this.getCategoryIcon(category)}"></i> ${category}
                                    </h6>
                                    <div class="sorted-files space-y-1"></div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>

                <div class="mt-4">
                    <button onclick="AIChallenge.validateDataSorting()" 
                            class="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded">
                        <i class="bi bi-check-circle"></i> Validate Dataset
                    </button>
                </div>

                <div id="data-feedback" class="mt-4"></div>
            </div>
        `;
    }

    static renderModelTraining() {
        return `
            <div>
                <h4 class="text-lg font-bold mb-2">Train Classification Model</h4>
                <p class="text-gray-300 mb-4">
                    Configure and train your machine learning model using the prepared dataset.
                </p>

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                        <h5 class="font-bold mb-3">Model Configuration</h5>
                        <div class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium mb-1">Algorithm</label>
                                <select id="algorithm" class="w-full bg-gray-700 border border-gray-600 rounded p-2">
                                    <option value="decision-tree">Decision Tree</option>
                                    <option value="neural-network">Neural Network</option>
                                    <option value="random-forest">Random Forest</option>
                                </select>
                            </div>

                            <div>
                                <label class="block text-sm font-medium mb-1">Learning Rate</label>
                                <input type="range" id="learning-rate" min="0.01" max="1" step="0.01" value="0.1" 
                                       class="w-full" oninput="AIChallenge.updateLearningRate()">
                                <div class="flex justify-between text-xs text-gray-400">
                                    <span>0.01</span>
                                    <span id="lr-value">0.1</span>
                                    <span>1.0</span>
                                </div>
                            </div>

                            <div>
                                <label class="block text-sm font-medium mb-1">Training Epochs</label>
                                <input type="number" id="epochs" min="10" max="1000" value="100" 
                                       class="w-full bg-gray-700 border border-gray-600 rounded p-2">
                            </div>

                            <button onclick="AIChallenge.startTraining()" 
                                    class="w-full bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded">
                                <i class="bi bi-play-fill"></i> Start Training
                            </button>
                        </div>
                    </div>

                    <div>
                        <h5 class="font-bold mb-3">Training Progress</h5>
                        <div class="bg-gray-800 border border-gray-600 rounded p-4">
                            <div id="training-status" class="mb-4">
                                <div class="text-gray-400">Ready to train model...</div>
                            </div>

                            <div class="mb-4">
                                <div class="flex justify-between text-sm mb-1">
                                    <span>Progress</span>
                                    <span id="training-progress">0%</span>
                                </div>
                                <div class="progress-bar">
                                    <div id="training-bar" class="progress-fill" style="width: 0%"></div>
                                </div>
                            </div>

                            <div id="training-metrics" class="space-y-2 text-sm">
                                <div class="flex justify-between">
                                    <span>Accuracy:</span>
                                    <span id="accuracy">-</span>
                                </div>
                                <div class="flex justify-between">
                                    <span>Loss:</span>
                                    <span id="loss">-</span>
                                </div>
                                <div class="flex justify-between">
                                    <span>Epoch:</span>
                                    <span id="current-epoch">0</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    static renderModelTesting() {
        const testFiles = [
            { filename: 'unknown1.jpg', size: 1536, extension: 'jpg', actualType: 'image' },
            { filename: 'mystery.mp3', size: 3072, extension: 'mp3', actualType: 'audio' },
            { filename: 'file.pdf', size: 768, extension: 'pdf', actualType: 'document' }
        ];

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
                            ${testFiles.map((file, index) => `
                                <div class="test-file bg-gray-800 border border-gray-600 rounded p-4" data-file-index="${index}">
                                    <div class="flex items-center justify-between mb-2">
                                        <span class="font-mono text-sm">${file.filename}</span>
                                        <span class="text-xs text-gray-400">${file.size}KB</span>
                                    </div>
                                    
                                    <div class="flex space-x-2">
                                        ${['image', 'document', 'audio', 'video'].map(type => `
                                            <button onclick="AIChallenge.classifyFile(${index}, '${type}')"
                                                    class="classify-btn flex-1 bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded text-xs">
                                                ${type}
                                            </button>
                                        `).join('')}
                                    </div>
                                    
                                    <div class="classification-result mt-2 text-sm hidden"></div>
                                </div>
                            `).join('')}
                        </div>

                        <button onclick="AIChallenge.evaluateModel()" 
                                class="w-full mt-4 bg-green-600 hover:bg-green-700 px-4 py-2 rounded">
                            <i class="bi bi-check-circle"></i> Evaluate Model
                        </button>
                    </div>

                    <div>
                        <h5 class="font-bold mb-3">Model Performance</h5>
                        <div id="model-results" class="bg-gray-800 border border-gray-600 rounded p-4">
                            <div class="text-gray-400">Make classifications to see results...</div>
                        </div>

                        <div class="mt-4">
                            <h5 class="font-bold mb-3">Feature Analysis</h5>
                            <div class="bg-gray-800 border border-gray-600 rounded p-4 text-sm">
                                <div class="mb-2"><strong>Key Features:</strong></div>
                                <ul class="text-gray-300 space-y-1">
                                    <li>• File extension (.jpg, .mp3, .pdf, etc.)</li>
                                    <li>• File size (images/videos typically larger)</li>
                                    <li>• Filename patterns</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    static switchPhase(phase) {
        this.currentPhase = phase;
        const content = document.getElementById('phase-content');
        content.innerHTML = this.renderCurrentPhase();
        
        if (phase === 'data-prep') {
            this.setupDragAndDrop();
        }
    }

    static setupDragAndDrop() {
        // Make files draggable
        document.querySelectorAll('.file-item').forEach(item => {
            item.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', e.target.dataset.fileIndex);
            });
        });

        // Make categories droppable
        document.querySelectorAll('.category-box').forEach(box => {
            box.addEventListener('dragover', (e) => e.preventDefault());
            
            box.addEventListener('drop', (e) => {
                e.preventDefault();
                const fileIndex = e.dataTransfer.getData('text/plain');
                const category = box.dataset.category;
                this.sortFile(fileIndex, category);
            });
        });
    }

    static sortFile(fileIndex, category) {
        const file = this.trainingData[fileIndex];
        const fileElement = document.querySelector(`[data-file-index="${fileIndex}"]`);
        const targetBox = document.querySelector(`[data-category="${category}"] .sorted-files`);
        
        // Create sorted file element
        const sortedElement = document.createElement('div');
        sortedElement.className = 'text-xs text-gray-300 bg-gray-700 px-2 py-1 rounded';
        sortedElement.textContent = file.filename;
        
        targetBox.appendChild(sortedElement);
        fileElement.remove();

        // Store the classification
        file.userCategory = category;
    }

    static validateDataSorting() {
        const feedback = document.getElementById('data-feedback');
        let correct = 0;
        let total = 0;

        this.trainingData.forEach(file => {
            if (file.userCategory) {
                total++;
                if (file.userCategory === file.type) {
                    correct++;
                }
            }
        });

        const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
        
        if (accuracy >= 80) {
            feedback.innerHTML = `
                <div class="text-green-400">
                    ✅ Dataset validated! Accuracy: ${accuracy}% (${correct}/${total})
                    <br>Ready to proceed to model training.
                </div>
            `;
        } else {
            feedback.innerHTML = `
                <div class="text-red-400">
                    ❌ Dataset needs improvement. Accuracy: ${accuracy}% (${correct}/${total})
                    <br>Sort more files correctly before training.
                </div>
            `;
        }
    }

    static updateLearningRate() {
        const value = document.getElementById('learning-rate').value;
        document.getElementById('lr-value').textContent = value;
    }

    static startTraining() {
        const statusDiv = document.getElementById('training-status');
        const progressSpan = document.getElementById('training-progress');
        const progressBar = document.getElementById('training-bar');
        const epochs = parseInt(document.getElementById('epochs').value);
        
        statusDiv.innerHTML = '<div class="text-blue-400">Training in progress...</div>';
        
        let currentEpoch = 0;
        const trainingInterval = setInterval(() => {
            currentEpoch++;
            const progress = Math.round((currentEpoch / epochs) * 100);
            const accuracy = Math.min(95, 60 + (currentEpoch / epochs) * 35);
            const loss = Math.max(0.05, 1.0 - (currentEpoch / epochs) * 0.95);
            
            progressSpan.textContent = `${progress}%`;
            progressBar.style.width = `${progress}%`;
            document.getElementById('accuracy').textContent = `${accuracy.toFixed(1)}%`;
            document.getElementById('loss').textContent = loss.toFixed(3);
            document.getElementById('current-epoch').textContent = currentEpoch;
            
            if (currentEpoch >= epochs) {
                clearInterval(trainingInterval);
                statusDiv.innerHTML = '<div class="text-green-400">Training completed!</div>';
                this.model = { trained: true, accuracy: accuracy };
            }
        }, 100);
    }

    static classifyFile(fileIndex, classification) {
        const testFiles = [
            { filename: 'unknown1.jpg', actualType: 'image' },
            { filename: 'mystery.mp3', actualType: 'audio' },
            { filename: 'file.pdf', actualType: 'document' }
        ];
        
        const file = testFiles[fileIndex];
        const resultDiv = document.querySelector(`[data-file-index="${fileIndex}"] .classification-result`);
        const isCorrect = classification === file.actualType;
        
        resultDiv.className = `classification-result mt-2 text-sm ${isCorrect ? 'text-green-400' : 'text-red-400'}`;
        resultDiv.textContent = `Classified as: ${classification} ${isCorrect ? '✅' : '❌'}`;
        resultDiv.classList.remove('hidden');
        
        file.userClassification = classification;
    }

    static evaluateModel() {
        const testFiles = [
            { filename: 'unknown1.jpg', actualType: 'image' },
            { filename: 'mystery.mp3', actualType: 'audio' },
            { filename: 'file.pdf', actualType: 'document' }
        ];
        
        let correct = 0;
        let total = 0;
        
        testFiles.forEach(file => {
            if (file.userClassification) {
                total++;
                if (file.userClassification === file.actualType) {
                    correct++;
                }
            }
        });
        
        const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
        const resultsDiv = document.getElementById('model-results');
        
        resultsDiv.innerHTML = `
            <div class="space-y-2">
                <div class="text-lg font-bold">Model Evaluation Results</div>
                <div class="text-${accuracy >= 67 ? 'green' : 'red'}-400">
                    Accuracy: ${accuracy}% (${correct}/${total} correct)
                </div>
                <div class="text-sm text-gray-300">
                    ${accuracy >= 67 ? 'Model performs well!' : 'Model needs improvement.'}
                </div>
            </div>
        `;
        
        if (accuracy >= 67) {
            setTimeout(() => this.completePuzzle(), 1500);
        }
    }

    static getCategoryColor(category) {
        const colors = { image: 'blue', document: 'green', audio: 'purple', video: 'red' };
        return colors[category] || 'gray';
    }

    static getCategoryIcon(category) {
        const icons = { image: 'image', document: 'file-text', audio: 'music-note', video: 'camera-video' };
        return icons[category] || 'file';
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
            window.game.closeChallenge();
        }, 2000);
    }
}
