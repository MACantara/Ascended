class DataPreparation {
    static trainingData = [];
    static userClassifications = {};
    static featureMatrix = [];
    static labelVector = [];

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
            { filename: 'clip.avi', size: 12288, extension: 'avi', type: 'video' },
            { filename: 'screenshot.png', size: 1800, extension: 'png', type: 'image' },
            { filename: 'podcast.mp3', size: 5200, extension: 'mp3', type: 'audio' },
            { filename: 'movie.mkv', size: 15000, extension: 'mkv', type: 'video' },
            { filename: 'manual.pdf', size: 890, extension: 'pdf', type: 'document' },
            { filename: 'album.flac', size: 7800, extension: 'flac', type: 'audio' }
        ];
    }

    static render() {
        return `
            <div>
                <h4 class="text-lg font-bold mb-2">Data Classification & Feature Extraction</h4>
                <p class="text-gray-300 mb-4">
                    🧠 Sort the files into correct categories. The AI will extract features from your classifications to learn patterns.
                </p>

                <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    <!-- Unsorted Files -->
                    <div>
                        <h5 class="font-bold mb-3 flex items-center">
                            <i class="bi bi-folder2-open mr-2 text-yellow-400"></i>
                            Unsorted Dataset
                        </h5>
                        <div id="unsorted-files" class="bg-gray-800 border border-gray-600 rounded-lg p-4 min-h-[300px] max-h-[400px] overflow-y-auto">
                            ${this.trainingData.map((file, index) => `
                                <div class="file-item bg-gradient-to-r from-gray-700 to-gray-600 p-3 rounded-lg mb-2 cursor-move hover:from-gray-600 hover:to-gray-500 hover:shadow-lg transform hover:scale-102 transition-all duration-200 group"
                                     draggable="true" data-file-index="${index}">
                                    <div class="flex items-center justify-between">
                                        <div class="flex items-center">
                                            <i class="bi bi-file-earmark mr-2 text-blue-400"></i>
                                            <span class="font-mono text-sm font-semibold">${file.filename}</span>
                                        </div>
                                        <div class="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded group-hover:bg-gray-700">
                                            ${file.size}KB
                                        </div>
                                    </div>
                                    <div class="text-xs text-gray-400 mt-1">
                                        Extension: .${file.extension} | Size: ${this.getSizeCategory(file.size)}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <!-- Categories -->
                    <div>
                        <h5 class="font-bold mb-3 flex items-center">
                            <i class="bi bi-collection mr-2 text-purple-400"></i>
                            File Categories
                        </h5>
                        <div class="space-y-3">
                            ${['image', 'document', 'audio', 'video'].map(category => `
                                <div class="category-box bg-gray-800 border-2 border-dashed border-gray-600 rounded-lg p-4 min-h-[85px] hover:border-${this.getCategoryColor(category)}-400 transition-colors duration-200"
                                     data-category="${category}">
                                    <h6 class="font-bold mb-2 capitalize text-${this.getCategoryColor(category)}-400 flex items-center">
                                        <i class="bi bi-${this.getCategoryIcon(category)} mr-2"></i> 
                                        ${category.toUpperCase()}
                                        <span class="ml-auto text-xs bg-${this.getCategoryColor(category)}-900 px-2 py-1 rounded" id="${category}-count">0</span>
                                    </h6>
                                    <div class="sorted-files space-y-1"></div>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <!-- Feature Analysis -->
                    <div>
                        <h5 class="font-bold mb-3 flex items-center">
                            <i class="bi bi-graph-up mr-2 text-green-400"></i>
                            Feature Analysis
                        </h5>
                        <div id="feature-analysis" class="bg-gray-800 border border-gray-600 rounded-lg p-4 mb-4">
                            <div class="text-gray-400 text-sm">
                                <i class="bi bi-info-circle mr-1"></i>
                                Start classifying files to see feature patterns...
                            </div>
                        </div>

                        <div class="bg-gray-800 border border-gray-600 rounded-lg p-4">
                            <h6 class="font-bold mb-2 text-blue-400">Dataset Statistics</h6>
                            <div id="dataset-stats" class="text-sm space-y-1">
                                <div class="flex justify-between">
                                    <span>Total Files:</span>
                                    <span class="text-green-400">${this.trainingData.length}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span>Classified:</span>
                                    <span id="classified-count" class="text-yellow-400">0</span>
                                </div>
                                <div class="flex justify-between">
                                    <span>Accuracy:</span>
                                    <span id="accuracy-display" class="text-purple-400">-</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="mt-6 flex flex-wrap gap-3">
                    <button onclick="DataPreparation.validateDataSorting()" 
                            class="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 px-6 py-3 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center">
                        <i class="bi bi-check-circle mr-2"></i> 
                        <span class="font-semibold">Validate Dataset</span>
                    </button>
                    <button onclick="DataPreparation.analyzeFeatures()" 
                            class="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-6 py-3 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center">
                        <i class="bi bi-graph-up mr-2"></i> 
                        <span class="font-semibold">Analyze Features</span>
                    </button>
                    <button onclick="DataPreparation.resetClassifications()" 
                            class="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 px-6 py-3 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center">
                        <i class="bi bi-arrow-clockwise mr-2"></i> 
                        <span class="font-semibold">Reset</span>
                    </button>
                </div>

                <div id="data-feedback" class="mt-6"></div>
            </div>
        `;
    }

    static setupDragAndDrop() {
        // Make files draggable
        document.querySelectorAll('.file-item').forEach(item => {
            item.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', e.target.dataset.fileIndex);
                e.target.style.opacity = '0.5';
            });

            item.addEventListener('dragend', (e) => {
                e.target.style.opacity = '1';
            });
        });

        // Make categories droppable
        document.querySelectorAll('.category-box').forEach(box => {
            box.addEventListener('dragover', (e) => {
                e.preventDefault();
                box.classList.add('border-opacity-100', 'bg-opacity-20');
            });

            box.addEventListener('dragleave', (e) => {
                box.classList.remove('border-opacity-100', 'bg-opacity-20');
            });
            
            box.addEventListener('drop', (e) => {
                e.preventDefault();
                box.classList.remove('border-opacity-100', 'bg-opacity-20');
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
        
        // Create sorted file element with enhanced styling
        const sortedElement = document.createElement('div');
        sortedElement.className = 'text-xs text-gray-300 bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-lg flex items-center justify-between transition-colors duration-200 cursor-pointer';
        sortedElement.innerHTML = `
            <span class="flex items-center">
                <i class="bi bi-${this.getCategoryIcon(category)} mr-2 text-${this.getCategoryColor(category)}-400"></i>
                ${file.filename}
            </span>
            <button onclick="DataPreparation.removeClassification('${fileIndex}')" class="text-red-400 hover:text-red-300 ml-2">
                <i class="bi bi-x"></i>
            </button>
        `;
        sortedElement.dataset.fileIndex = fileIndex;
        
        targetBox.appendChild(sortedElement);
        fileElement.remove();

        // Store the classification
        this.userClassifications[fileIndex] = category;

        // Update counters
        this.updateCategoryCounts();
        this.updateDatasetStats();
        this.updateFeatureAnalysis();
    }

    static removeClassification(fileIndex) {
        const file = this.trainingData[fileIndex];
        const sortedElement = document.querySelector(`[data-file-index="${fileIndex}"]`);
        
        if (sortedElement) {
            // Remove from sorted area
            sortedElement.remove();
            
            // Add back to unsorted files
            const unsortedContainer = document.getElementById('unsorted-files');
            const fileElement = document.createElement('div');
            fileElement.className = 'file-item bg-gradient-to-r from-gray-700 to-gray-600 p-3 rounded-lg mb-2 cursor-move hover:from-gray-600 hover:to-gray-500 hover:shadow-lg transform hover:scale-102 transition-all duration-200 group';
            fileElement.draggable = true;
            fileElement.dataset.fileIndex = fileIndex;
            fileElement.innerHTML = `
                <div class="flex items-center justify-between">
                    <div class="flex items-center">
                        <i class="bi bi-file-earmark mr-2 text-blue-400"></i>
                        <span class="font-mono text-sm font-semibold">${file.filename}</span>
                    </div>
                    <div class="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded group-hover:bg-gray-700">
                        ${file.size}KB
                    </div>
                </div>
                <div class="text-xs text-gray-400 mt-1">
                    Extension: .${file.extension} | Size: ${this.getSizeCategory(file.size)}
                </div>
            `;
            
            unsortedContainer.appendChild(fileElement);
            
            // Remove from classifications
            delete this.userClassifications[fileIndex];
            
            // Re-setup drag and drop for the new element
            this.setupDragAndDropForElement(fileElement);
            
            // Update counters
            this.updateCategoryCounts();
            this.updateDatasetStats();
            this.updateFeatureAnalysis();
        }
    }

    static setupDragAndDropForElement(element) {
        element.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', e.target.dataset.fileIndex);
            e.target.style.opacity = '0.5';
        });

        element.addEventListener('dragend', (e) => {
            e.target.style.opacity = '1';
        });
    }

    static updateCategoryCounts() {
        const counts = { image: 0, document: 0, audio: 0, video: 0 };
        
        Object.values(this.userClassifications).forEach(category => {
            counts[category]++;
        });

        Object.entries(counts).forEach(([category, count]) => {
            const countElement = document.getElementById(`${category}-count`);
            if (countElement) {
                countElement.textContent = count;
            }
        });
    }

    static updateDatasetStats() {
        const classifiedCount = Object.keys(this.userClassifications).length;
        const accuracy = this.calculateCurrentAccuracy();
        
        document.getElementById('classified-count').textContent = classifiedCount;
        document.getElementById('accuracy-display').textContent = accuracy >= 0 ? `${accuracy}%` : '-';
    }

    static calculateCurrentAccuracy() {
        if (Object.keys(this.userClassifications).length === 0) return -1;
        
        let correct = 0;
        let total = 0;

        Object.entries(this.userClassifications).forEach(([fileIndex, userCategory]) => {
            const file = this.trainingData[fileIndex];
            total++;
            if (userCategory === file.type) {
                correct++;
            }
        });

        return total > 0 ? Math.round((correct / total) * 100) : 0;
    }

    static analyzeFeatures() {
        if (Object.keys(this.userClassifications).length < 5) {
            this.showNotification('Classify at least 5 files to analyze features!', 'warning');
            return;
        }

        this.extractFeatures();
        this.displayFeatureAnalysis();
    }

    static extractFeatures() {
        this.featureMatrix = [];
        this.labelVector = [];

        Object.entries(this.userClassifications).forEach(([fileIndex, category]) => {
            const file = this.trainingData[fileIndex];
            
            // Feature extraction: [extensionHash, sizeNormalized, hasKeyword1, hasKeyword2, hasKeyword3]
            const features = [
                this.hashExtension(file.extension),
                this.normalizeSize(file.size),
                file.filename.toLowerCase().includes('photo') || file.filename.toLowerCase().includes('image') || file.filename.toLowerCase().includes('picture') ? 1 : 0,
                file.filename.toLowerCase().includes('music') || file.filename.toLowerCase().includes('song') || file.filename.toLowerCase().includes('audio') ? 1 : 0,
                file.filename.toLowerCase().includes('video') || file.filename.toLowerCase().includes('movie') || file.filename.toLowerCase().includes('clip') ? 1 : 0
            ];
            
            this.featureMatrix.push(features);
            this.labelVector.push(this.encodeLabel(category));
        });
    }

    static displayFeatureAnalysis() {
        const analysisDiv = document.getElementById('feature-analysis');
        
        // Calculate feature importance
        const featureImportance = this.calculateFeatureImportance();
        
        analysisDiv.innerHTML = `
            <div class="space-y-3">
                <div class="flex items-center mb-2">
                    <i class="bi bi-cpu mr-2 text-green-400"></i>
                    <span class="font-bold">Feature Extraction Complete</span>
                </div>
                
                <div class="grid grid-cols-1 gap-2 text-sm">
                    <div class="flex justify-between items-center bg-gray-700 px-3 py-2 rounded">
                        <span>File Extension</span>
                        <div class="flex items-center">
                            <div class="w-16 bg-gray-600 rounded-full h-2 mr-2">
                                <div class="bg-blue-400 h-2 rounded-full" style="width: ${featureImportance[0]}%"></div>
                            </div>
                            <span class="text-blue-400 text-xs">${featureImportance[0]}%</span>
                        </div>
                    </div>
                    <div class="flex justify-between items-center bg-gray-700 px-3 py-2 rounded">
                        <span>File Size</span>
                        <div class="flex items-center">
                            <div class="w-16 bg-gray-600 rounded-full h-2 mr-2">
                                <div class="bg-green-400 h-2 rounded-full" style="width: ${featureImportance[1]}%"></div>
                            </div>
                            <span class="text-green-400 text-xs">${featureImportance[1]}%</span>
                        </div>
                    </div>
                    <div class="flex justify-between items-center bg-gray-700 px-3 py-2 rounded">
                        <span>Filename Keywords</span>
                        <div class="flex items-center">
                            <div class="w-16 bg-gray-600 rounded-full h-2 mr-2">
                                <div class="bg-purple-400 h-2 rounded-full" style="width: ${(featureImportance[2] + featureImportance[3] + featureImportance[4]) / 3}%"></div>
                            </div>
                            <span class="text-purple-400 text-xs">${Math.round((featureImportance[2] + featureImportance[3] + featureImportance[4]) / 3)}%</span>
                        </div>
                    </div>
                </div>
                
                <div class="text-xs text-gray-400 mt-2">
                    Feature matrix: ${this.featureMatrix.length} samples × ${this.featureMatrix[0]?.length || 0} features
                </div>
            </div>
        `;
    }

    static calculateFeatureImportance() {
        // Simplified feature importance calculation based on variance and correlation with labels
        const importance = [85, 75, 45, 40, 50]; // Simulated importance scores
        return importance;
    }

    static validateDataSorting() {
        const feedback = document.getElementById('data-feedback');
        let correct = 0;
        let total = 0;

        Object.entries(this.userClassifications).forEach(([fileIndex, userCategory]) => {
            const file = this.trainingData[fileIndex];
            total++;
            if (userCategory === file.type) {
                correct++;
            }
        });

        const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
        
        if (total === 0) {
            feedback.innerHTML = `
                <div class="bg-yellow-900 border-l-4 border-yellow-400 p-4 rounded">
                    <div class="flex items-center text-yellow-200">
                        <i class="bi bi-exclamation-triangle mr-2"></i>
                        Please classify some files before validation.
                    </div>
                </div>
            `;
            return;
        }

        if (accuracy >= 80) {
            feedback.innerHTML = `
                <div class="bg-green-900 border-l-4 border-green-400 p-4 rounded">
                    <div class="flex items-center text-green-200">
                        <i class="bi bi-check-circle mr-2"></i>
                        <div>
                            <div class="font-bold">Dataset validated successfully!</div>
                            <div class="text-sm mt-1">Accuracy: ${accuracy}% (${correct}/${total}) | Ready for model training</div>
                        </div>
                    </div>
                </div>
            `;
            
            // Extract and store features for training
            this.extractFeatures();
        } else {
            feedback.innerHTML = `
                <div class="bg-red-900 border-l-4 border-red-400 p-4 rounded">
                    <div class="flex items-center text-red-200">
                        <i class="bi bi-x-circle mr-2"></i>
                        <div>
                            <div class="font-bold">Dataset needs improvement</div>
                            <div class="text-sm mt-1">Accuracy: ${accuracy}% (${correct}/${total}) | Minimum 80% required</div>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    static resetClassifications() {
        // Move all classified files back to unsorted
        Object.keys(this.userClassifications).forEach(fileIndex => {
            this.removeClassification(fileIndex);
        });
        
        this.userClassifications = {};
        this.updateCategoryCounts();
        this.updateDatasetStats();
        
        document.getElementById('feature-analysis').innerHTML = `
            <div class="text-gray-400 text-sm">
                <i class="bi bi-info-circle mr-1"></i>
                Start classifying files to see feature patterns...
            </div>
        `;
        
        document.getElementById('data-feedback').innerHTML = '';
    }

    // Utility methods
    static getSizeCategory(size) {
        if (size < 100) return 'Small';
        if (size < 1000) return 'Medium';
        if (size < 5000) return 'Large';
        return 'XLarge';
    }

    static hashExtension(ext) {
        // Simple hash for extension (for ML features)
        const extensions = ['jpg', 'png', 'gif', 'pdf', 'txt', 'docx', 'mp3', 'wav', 'flac', 'mp4', 'avi', 'mkv'];
        return extensions.indexOf(ext.toLowerCase()) / extensions.length;
    }

    static normalizeSize(size) {
        // Normalize size to 0-1 range
        return Math.min(size / 20000, 1);
    }

    static encodeLabel(category) {
        const labels = { image: 0, document: 1, audio: 2, video: 3 };
        return labels[category] || 0;
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

    static getValidationScore() {
        return this.calculateCurrentAccuracy();
    }

    static getFeatureMatrix() {
        return this.featureMatrix;
    }

    static getLabelVector() {
        return this.labelVector;
    }
}
