class ModelTraining {
    static model = null;
    static trainingInProgress = false;

    static render() {
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
                                       class="w-full" oninput="ModelTraining.updateLearningRate()">
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

                            <button onclick="ModelTraining.startTraining()" 
                                    class="w-full bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded"
                                    id="train-btn">
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
                                <div class="progress-bar bg-gray-700 rounded-full h-2">
                                    <div id="training-bar" class="bg-purple-600 h-2 rounded-full transition-all duration-300" style="width: 0%"></div>
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

                        <div class="mt-4">
                            <h5 class="font-bold mb-2">Training Tips</h5>
                            <div class="bg-gray-800 border border-gray-600 rounded p-3 text-sm text-gray-300">
                                <ul class="space-y-1">
                                    <li>• Lower learning rates = more stable training</li>
                                    <li>• More epochs = better learning (but slower)</li>
                                    <li>• Neural networks work well for this task</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    static updateLearningRate() {
        const value = document.getElementById('learning-rate').value;
        document.getElementById('lr-value').textContent = value;
    }

    static startTraining() {
        if (this.trainingInProgress) return;

        const statusDiv = document.getElementById('training-status');
        const progressSpan = document.getElementById('training-progress');
        const progressBar = document.getElementById('training-bar');
        const epochs = parseInt(document.getElementById('epochs').value);
        const trainBtn = document.getElementById('train-btn');
        
        this.trainingInProgress = true;
        trainBtn.disabled = true;
        trainBtn.innerHTML = '<i class="bi bi-hourglass-split"></i> Training...';
        
        statusDiv.innerHTML = '<div class="text-blue-400"><i class="bi bi-gear animate-spin mr-2"></i>Training in progress...</div>';
        
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
                statusDiv.innerHTML = '<div class="text-green-400"><i class="bi bi-check-circle mr-2"></i>Training completed successfully!</div>';
                this.model = { 
                    trained: true, 
                    accuracy: accuracy,
                    algorithm: document.getElementById('algorithm').value,
                    learningRate: document.getElementById('learning-rate').value,
                    epochs: epochs
                };
                this.trainingInProgress = false;
                trainBtn.disabled = false;
                trainBtn.innerHTML = '<i class="bi bi-arrow-clockwise"></i> Retrain Model';
            }
        }, 50); // Faster animation for better UX
    }

    static getTrainedModel() {
        return this.model;
    }

    static isModelTrained() {
        return this.model && this.model.trained;
    }
}
