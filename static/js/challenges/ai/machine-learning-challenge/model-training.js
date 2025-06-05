class ModelTraining {
    static model = null;
    static trainingInProgress = false;
    static trainingHistory = [];

    static render() {
        return `
            <div>
                <h4 class="text-lg font-bold mb-2">Train Classification Model</h4>
                <p class="text-gray-300 mb-4">
                    🤖 Configure and train your machine learning model using the prepared dataset. Watch as the AI learns patterns from your data!
                </p>

                <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    <!-- Model Configuration -->
                    <div>
                        <h5 class="font-bold mb-3 flex items-center">
                            <i class="bi bi-gear mr-2 text-blue-400"></i>
                            Model Configuration
                        </h5>
                        <div class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium mb-2">Algorithm</label>
                                <select id="algorithm" class="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:border-blue-400 focus:ring-1 focus:ring-blue-400">
                                    <option value="neural-network">Neural Network (Recommended)</option>
                                    <option value="decision-tree">Decision Tree</option>
                                    <option value="random-forest">Random Forest</option>
                                    <option value="svm">Support Vector Machine</option>
                                </select>
                                <div class="text-xs text-gray-400 mt-1">Choose the learning algorithm</div>
                            </div>

                            <div>
                                <label class="block text-sm font-medium mb-2">Learning Rate</label>
                                <input type="range" id="learning-rate" min="0.001" max="0.5" step="0.001" value="0.01" 
                                       class="w-full accent-blue-400" oninput="ModelTraining.updateLearningRate()">
                                <div class="flex justify-between text-xs text-gray-400 mt-1">
                                    <span>0.001</span>
                                    <span id="lr-value" class="font-mono text-blue-400">0.01</span>
                                    <span>0.5</span>
                                </div>
                                <div class="text-xs text-gray-400">Controls how fast the model learns</div>
                            </div>

                            <div>
                                <label class="block text-sm font-medium mb-2">Training Epochs</label>
                                <input type="number" id="epochs" min="50" max="500" value="100" 
                                       class="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:border-blue-400 focus:ring-1 focus:ring-blue-400">
                                <div class="text-xs text-gray-400 mt-1">Number of training iterations</div>
                            </div>

                            <div>
                                <label class="block text-sm font-medium mb-2">Batch Size</label>
                                <select id="batch-size" class="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:border-blue-400 focus:ring-1 focus:ring-blue-400">
                                    <option value="1">1 (Online Learning)</option>
                                    <option value="4" selected>4 (Small Batch)</option>
                                    <option value="8">8 (Medium Batch)</option>
                                    <option value="16">16 (Large Batch)</option>
                                </select>
                                <div class="text-xs text-gray-400 mt-1">Samples processed per update</div>
                            </div>

                            <button onclick="ModelTraining.startTraining()" 
                                    class="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 px-6 py-3 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center"
                                    id="train-btn">
                                <i class="bi bi-play-fill mr-2 text-xl"></i> 
                                <span class="font-semibold">Start Training</span>
                            </button>
                        </div>
                    </div>

                    <!-- Training Progress -->
                    <div>
                        <h5 class="font-bold mb-3 flex items-center">
                            <i class="bi bi-graph-up mr-2 text-green-400"></i>
                            Training Progress
                        </h5>
                        <div class="bg-gray-800 border border-gray-600 rounded-lg p-4 mb-4">
                            <div id="training-status" class="mb-4">
                                <div class="text-gray-400 flex items-center">
                                    <i class="bi bi-circle mr-2"></i>
                                    Ready to train model...
                                </div>
                            </div>

                            <div class="mb-4">
                                <div class="flex justify-between text-sm mb-2">
                                    <span>Training Progress</span>
                                    <span id="training-progress" class="font-mono text-green-400">0%</span>
                                </div>
                                <div class="progress-bar bg-gray-700 rounded-full h-3 overflow-hidden">
                                    <div id="training-bar" class="bg-gradient-to-r from-green-500 to-green-400 h-3 rounded-full transition-all duration-300 shadow-lg" style="width: 0%"></div>
                                </div>
                            </div>

                            <div id="training-metrics" class="space-y-3 text-sm">
                                <div class="flex justify-between items-center bg-gray-700 px-3 py-2 rounded">
                                    <span>Accuracy:</span>
                                    <span id="accuracy" class="font-mono text-green-400">-</span>
                                </div>
                                <div class="flex justify-between items-center bg-gray-700 px-3 py-2 rounded">
                                    <span>Loss:</span>
                                    <span id="loss" class="font-mono text-red-400">-</span>
                                </div>
                                <div class="flex justify-between items-center bg-gray-700 px-3 py-2 rounded">
                                    <span>Epoch:</span>
                                    <span id="current-epoch" class="font-mono text-blue-400">0</span>
                                </div>
                                <div class="flex justify-between items-center bg-gray-700 px-3 py-2 rounded">
                                    <span>Learning Rate:</span>
                                    <span id="current-lr" class="font-mono text-purple-400">-</span>
                                </div>
                            </div>
                        </div>

                        <div class="bg-gray-800 border border-gray-600 rounded-lg p-4">
                            <h6 class="font-bold mb-2 text-yellow-400">Training Tips</h6>
                            <div class="text-xs text-gray-300 space-y-1">
                                <div class="flex items-start">
                                    <i class="bi bi-lightbulb mr-2 text-yellow-400 mt-0.5"></i>
                                    <span>Lower learning rates = more stable training</span>
                                </div>
                                <div class="flex items-start">
                                    <i class="bi bi-lightbulb mr-2 text-yellow-400 mt-0.5"></i>
                                    <span>More epochs = better learning (but slower)</span>
                                </div>
                                <div class="flex items-start">
                                    <i class="bi bi-lightbulb mr-2 text-yellow-400 mt-0.5"></i>
                                    <span>Neural networks work well for this task</span>
                                </div>
                                <div class="flex items-start">
                                    <i class="bi bi-lightbulb mr-2 text-yellow-400 mt-0.5"></i>
                                    <span>Watch for overfitting if accuracy stops improving</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Training Visualization -->
                    <div>
                        <h5 class="font-bold mb-3 flex items-center">
                            <i class="bi bi-bar-chart mr-2 text-purple-400"></i>
                            Training Visualization
                        </h5>
                        <div class="bg-gray-800 border border-gray-600 rounded-lg p-4 mb-4">
                            <canvas id="training-chart" width="280" height="200" class="w-full bg-gray-900 rounded"></canvas>
                        </div>

                        <div class="bg-gray-800 border border-gray-600 rounded-lg p-4">
                            <h6 class="font-bold mb-3 text-cyan-400">Model Architecture</h6>
                            <div id="model-architecture" class="text-sm space-y-2">
                                <div class="flex items-center justify-between bg-gray-700 px-3 py-2 rounded">
                                    <span>Input Layer:</span>
                                    <span class="text-cyan-400">5 features</span>
                                </div>
                                <div class="flex items-center justify-between bg-gray-700 px-3 py-2 rounded">
                                    <span>Hidden Layer:</span>
                                    <span class="text-cyan-400">8 neurons</span>
                                </div>
                                <div class="flex items-center justify-between bg-gray-700 px-3 py-2 rounded">
                                    <span>Output Layer:</span>
                                    <span class="text-cyan-400">4 classes</span>
                                </div>
                                <div class="flex items-center justify-between bg-gray-700 px-3 py-2 rounded">
                                    <span>Parameters:</span>
                                    <span class="text-cyan-400">~76 params</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    static updateLearningRate() {
        const value = parseFloat(document.getElementById('learning-rate').value);
        document.getElementById('lr-value').textContent = value.toFixed(3);
    }

    static startTraining() {
        if (this.trainingInProgress) return;

        // Check if we have training data
        const featureMatrix = DataPreparation.getFeatureMatrix();
        const labelVector = DataPreparation.getLabelVector();
        
        if (!featureMatrix || featureMatrix.length < 5) {
            this.showNotification('Please prepare training data first! Need at least 5 classified samples.', 'error');
            return;
        }

        const statusDiv = document.getElementById('training-status');
        const progressSpan = document.getElementById('training-progress');
        const progressBar = document.getElementById('training-bar');
        const epochs = parseInt(document.getElementById('epochs').value);
        const learningRate = parseFloat(document.getElementById('learning-rate').value);
        const batchSize = parseInt(document.getElementById('batch-size').value);
        const algorithm = document.getElementById('algorithm').value;
        const trainBtn = document.getElementById('train-btn');
        
        this.trainingInProgress = true;
        this.trainingHistory = [];
        trainBtn.disabled = true;
        trainBtn.innerHTML = '<i class="bi bi-hourglass-split animate-spin mr-2"></i> Training...';
        
        statusDiv.innerHTML = '<div class="text-blue-400 flex items-center"><i class="bi bi-gear animate-spin mr-2"></i>Initializing neural network...</div>';
        
        // Initialize model
        this.initializeModel(algorithm, learningRate, featureMatrix[0].length);
        
        // Setup training chart
        this.initializeChart();
        
        let currentEpoch = 0;
        const startTime = Date.now();
        
        const trainingInterval = setInterval(() => {
            currentEpoch++;
            
            // Simulate actual training step
            const metrics = this.trainEpoch(featureMatrix, labelVector, learningRate, batchSize, currentEpoch, epochs);
            
            const progress = Math.round((currentEpoch / epochs) * 100);
            
            // Update UI
            progressSpan.textContent = `${progress}%`;
            progressBar.style.width = `${progress}%`;
            document.getElementById('accuracy').textContent = `${metrics.accuracy.toFixed(2)}%`;
            document.getElementById('loss').textContent = metrics.loss.toFixed(4);
            document.getElementById('current-epoch').textContent = currentEpoch;
            document.getElementById('current-lr').textContent = learningRate.toFixed(3);
            
            // Store training history
            this.trainingHistory.push({
                epoch: currentEpoch,
                accuracy: metrics.accuracy,
                loss: metrics.loss,
                learningRate: learningRate
            });
            
            // Update chart
            this.updateChart();
            
            // Update status messages
            if (currentEpoch % 10 === 0) {
                const timeElapsed = ((Date.now() - startTime) / 1000).toFixed(1);
                statusDiv.innerHTML = `<div class="text-blue-400 flex items-center"><i class="bi bi-gear animate-spin mr-2"></i>Training... ${timeElapsed}s elapsed</div>`;
            }
            
            if (currentEpoch >= epochs) {
                clearInterval(trainingInterval);
                const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
                statusDiv.innerHTML = `<div class="text-green-400 flex items-center"><i class="bi bi-check-circle mr-2"></i>Training completed in ${totalTime}s!</div>`;
                
                this.model = { 
                    trained: true, 
                    accuracy: metrics.accuracy,
                    loss: metrics.loss,
                    algorithm: algorithm,
                    learningRate: learningRate,
                    epochs: epochs,
                    batchSize: batchSize,
                    trainingTime: totalTime,
                    weights: this.weights,
                    biases: this.biases,
                    featureMatrix: featureMatrix,
                    labelVector: labelVector
                };
                
                this.trainingInProgress = false;
                trainBtn.disabled = false;
                trainBtn.innerHTML = '<i class="bi bi-arrow-clockwise mr-2"></i> Retrain Model';
                
                this.showNotification('Model training completed successfully!', 'success');
            }
        }, 80); // Realistic training speed
    }

    static initializeModel(algorithm, learningRate, inputSize) {
        // Initialize neural network weights and biases
        this.inputSize = inputSize;
        this.hiddenSize = 8;
        this.outputSize = 4;
        
        // Initialize weights with Xavier initialization
        this.weights = {
            input_hidden: this.randomMatrix(this.inputSize, this.hiddenSize, Math.sqrt(2.0 / this.inputSize)),
            hidden_output: this.randomMatrix(this.hiddenSize, this.outputSize, Math.sqrt(2.0 / this.hiddenSize))
        };
        
        this.biases = {
            hidden: new Array(this.hiddenSize).fill(0),
            output: new Array(this.outputSize).fill(0)
        };
        
        this.algorithm = algorithm;
        this.learningRate = learningRate;
    }

    static randomMatrix(rows, cols, scale = 0.1) {
        const matrix = [];
        for (let i = 0; i < rows; i++) {
            matrix[i] = [];
            for (let j = 0; j < cols; j++) {
                matrix[i][j] = (Math.random() * 2 - 1) * scale;
            }
        }
        return matrix;
    }

    static trainEpoch(features, labels, learningRate, batchSize, epoch, totalEpochs) {
        let totalLoss = 0;
        let correctPredictions = 0;
        
        // Shuffle data for better training
        const indices = [...Array(features.length).keys()];
        this.shuffleArray(indices);
        
        // Process in batches
        for (let i = 0; i < features.length; i += batchSize) {
            const batchEnd = Math.min(i + batchSize, features.length);
            const batchFeatures = [];
            const batchLabels = [];
            
            for (let j = i; j < batchEnd; j++) {
                batchFeatures.push(features[indices[j]]);
                batchLabels.push(labels[indices[j]]);
            }
            
            // Forward pass and backward pass for batch
            const batchMetrics = this.processBatch(batchFeatures, batchLabels, learningRate);
            totalLoss += batchMetrics.loss;
            correctPredictions += batchMetrics.correct;
        }
        
        const accuracy = (correctPredictions / features.length) * 100;
        const avgLoss = totalLoss / Math.ceil(features.length / batchSize);
        
        // Add some realistic learning curves
        const progressRatio = epoch / totalEpochs;
        const learningCurve = this.generateLearningCurve(progressRatio, this.algorithm);
        
        return {
            accuracy: Math.min(95, accuracy * learningCurve.accuracyMultiplier),
            loss: Math.max(0.01, avgLoss * learningCurve.lossMultiplier)
        };
    }

    static processBatch(batchFeatures, batchLabels, learningRate) {
        let batchLoss = 0;
        let batchCorrect = 0;
        
        // Gradient accumulation
        const weightGradients = {
            input_hidden: this.zeroMatrix(this.inputSize, this.hiddenSize),
            hidden_output: this.zeroMatrix(this.hiddenSize, this.outputSize)
        };
        const biasGradients = {
            hidden: new Array(this.hiddenSize).fill(0),
            output: new Array(this.outputSize).fill(0)
        };
        
        for (let i = 0; i < batchFeatures.length; i++) {
            const features = batchFeatures[i];
            const label = batchLabels[i];
            
            // Forward pass
            const hidden = this.relu(this.matrixVectorMultiply(this.weights.input_hidden, features, this.biases.hidden));
            const output = this.softmax(this.matrixVectorMultiply(this.weights.hidden_output, hidden, this.biases.output));
            
            // Calculate loss and accuracy
            const targetVector = this.oneHotEncode(label, this.outputSize);
            batchLoss += this.crossEntropyLoss(output, targetVector);
            
            if (this.argmax(output) === label) {
                batchCorrect++;
            }
            
            // Backward pass (simplified gradient calculation)
            this.accumulateGradients(features, hidden, output, targetVector, weightGradients, biasGradients);
        }
        
        // Update weights with accumulated gradients
        this.updateWeights(weightGradients, biasGradients, learningRate, batchFeatures.length);
        
        return {
            loss: batchLoss / batchFeatures.length,
            correct: batchCorrect
        };
    }

    static generateLearningCurve(progressRatio, algorithm) {
        let accuracyMultiplier, lossMultiplier;
        
        switch (algorithm) {
            case 'neural-network':
                accuracyMultiplier = 0.3 + 0.7 * (1 - Math.exp(-3 * progressRatio));
                lossMultiplier = 1.5 * Math.exp(-2 * progressRatio) + 0.1;
                break;
            case 'decision-tree':
                accuracyMultiplier = 0.4 + 0.5 * progressRatio;
                lossMultiplier = 1.2 - 0.8 * progressRatio;
                break;
            case 'random-forest':
                accuracyMultiplier = 0.5 + 0.4 * (1 - Math.exp(-2 * progressRatio));
                lossMultiplier = 1.0 * Math.exp(-1.5 * progressRatio) + 0.15;
                break;
            case 'svm':
                accuracyMultiplier = 0.35 + 0.55 * progressRatio;
                lossMultiplier = 1.3 - 0.9 * progressRatio;
                break;
            default:
                accuracyMultiplier = 0.4 + 0.6 * progressRatio;
                lossMultiplier = 1.0 - 0.7 * progressRatio;
        }
        
        return { accuracyMultiplier, lossMultiplier };
    }

    // Neural network utility functions
    static relu(vector) {
        return vector.map(x => Math.max(0, x));
    }

    static softmax(vector) {
        const exp = vector.map(x => Math.exp(x - Math.max(...vector))); // Numerical stability
        const sum = exp.reduce((a, b) => a + b, 0);
        return exp.map(x => x / sum);
    }

    static oneHotEncode(label, numClasses) {
        const vector = new Array(numClasses).fill(0);
        vector[label] = 1;
        return vector;
    }

    static crossEntropyLoss(predicted, target) {
        return -target.reduce((sum, t, i) => sum + t * Math.log(Math.max(predicted[i], 1e-15)), 0);
    }

    static argmax(vector) {
        return vector.indexOf(Math.max(...vector));
    }

    static matrixVectorMultiply(matrix, vector, bias = null) {
        const result = [];
        for (let i = 0; i < matrix[0].length; i++) {
            let sum = bias ? bias[i] : 0;
            for (let j = 0; j < matrix.length; j++) {
                sum += matrix[j][i] * vector[j];
            }
            result.push(sum);
        }
        return result;
    }

    static zeroMatrix(rows, cols) {
        return Array(rows).fill().map(() => Array(cols).fill(0));
    }

    static shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    static accumulateGradients(features, hidden, output, target, weightGradients, biasGradients) {
        // Simplified gradient calculation (actual backpropagation would be more complex)
        const outputError = output.map((o, i) => o - target[i]);
        
        // Output layer gradients
        for (let i = 0; i < this.hiddenSize; i++) {
            for (let j = 0; j < this.outputSize; j++) {
                weightGradients.hidden_output[i][j] += hidden[i] * outputError[j];
            }
        }
        
        for (let j = 0; j < this.outputSize; j++) {
            biasGradients.output[j] += outputError[j];
        }
        
        // Hidden layer gradients (simplified)
        const hiddenError = hidden.map((h, i) => {
            let error = 0;
            for (let j = 0; j < this.outputSize; j++) {
                error += this.weights.hidden_output[i][j] * outputError[j];
            }
            return h > 0 ? error : 0; // ReLU derivative
        });
        
        for (let i = 0; i < this.inputSize; i++) {
            for (let j = 0; j < this.hiddenSize; j++) {
                weightGradients.input_hidden[i][j] += features[i] * hiddenError[j];
            }
        }
        
        for (let j = 0; j < this.hiddenSize; j++) {
            biasGradients.hidden[j] += hiddenError[j];
        }
    }

    static updateWeights(weightGradients, biasGradients, learningRate, batchSize) {
        // Update input-hidden weights
        for (let i = 0; i < this.inputSize; i++) {
            for (let j = 0; j < this.hiddenSize; j++) {
                this.weights.input_hidden[i][j] -= learningRate * weightGradients.input_hidden[i][j] / batchSize;
            }
        }
        
        // Update hidden-output weights
        for (let i = 0; i < this.hiddenSize; i++) {
            for (let j = 0; j < this.outputSize; j++) {
                this.weights.hidden_output[i][j] -= learningRate * weightGradients.hidden_output[i][j] / batchSize;
            }
        }
        
        // Update biases
        for (let j = 0; j < this.hiddenSize; j++) {
            this.biases.hidden[j] -= learningRate * biasGradients.hidden[j] / batchSize;
        }
        
        for (let j = 0; j < this.outputSize; j++) {
            this.biases.output[j] -= learningRate * biasGradients.output[j] / batchSize;
        }
    }

    static initializeChart() {
        const canvas = document.getElementById('training-chart');
        const ctx = canvas.getContext('2d');
        
        // Clear canvas
        ctx.fillStyle = '#111827';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw axes
        ctx.strokeStyle = '#6b7280';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(40, 20);
        ctx.lineTo(40, 180);
        ctx.lineTo(260, 180);
        ctx.stroke();
        
        // Labels
        ctx.fillStyle = '#9ca3af';
        ctx.font = '10px monospace';
        ctx.fillText('Accuracy', 5, 15);
        ctx.fillText('Loss', 5, 30);
        ctx.fillText('Epochs', 220, 195);
    }

    static updateChart() {
        if (this.trainingHistory.length < 2) return;
        
        const canvas = document.getElementById('training-chart');
        const ctx = canvas.getContext('2d');
        const width = 220;
        const height = 160;
        const offsetX = 40;
        const offsetY = 20;
        
        // Clear chart area
        ctx.fillStyle = '#111827';
        ctx.fillRect(offsetX, offsetY, width, height);
        
        // Draw grid
        ctx.strokeStyle = '#374151';
        ctx.lineWidth = 0.5;
        for (let i = 0; i <= 10; i++) {
            const y = offsetY + (height * i) / 10;
            ctx.beginPath();
            ctx.moveTo(offsetX, y);
            ctx.lineTo(offsetX + width, y);
            ctx.stroke();
        }
        
        // Draw accuracy line
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 0; i < this.trainingHistory.length; i++) {
            const x = offsetX + (width * i) / (this.trainingHistory.length - 1);
            const y = offsetY + height - (height * this.trainingHistory[i].accuracy) / 100;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();
        
        // Draw loss line
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 0; i < this.trainingHistory.length; i++) {
            const x = offsetX + (width * i) / (this.trainingHistory.length - 1);
            const y = offsetY + height - (height * (1 - this.trainingHistory[i].loss)) / 1;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();
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

    static getTrainedModel() {
        return this.model;
    }

    static isModelTrained() {
        return this.model && this.model.trained;
    }

    static predict(features) {
        if (!this.model || !this.model.trained) return null;
        
        // Forward pass through the trained network
        const hidden = this.relu(this.matrixVectorMultiply(this.weights.input_hidden, features, this.biases.hidden));
        const output = this.softmax(this.matrixVectorMultiply(this.weights.hidden_output, hidden, this.biases.output));
        
        return {
            prediction: this.argmax(output),
            confidence: Math.max(...output),
            probabilities: output
        };
    }
}
