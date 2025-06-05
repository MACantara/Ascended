class DataPreparation {
    static trainingData = [];
    static userClassifications = {};

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

    static render() {
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
                    <button onclick="DataPreparation.validateDataSorting()" 
                            class="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded">
                        <i class="bi bi-check-circle"></i> Validate Dataset
                    </button>
                </div>

                <div id="data-feedback" class="mt-4"></div>
            </div>
        `;
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
        this.userClassifications[fileIndex] = category;
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

    static getCategoryColor(category) {
        const colors = { image: 'blue', document: 'green', audio: 'purple', video: 'red' };
        return colors[category] || 'gray';
    }

    static getCategoryIcon(category) {
        const icons = { image: 'image', document: 'file-text', audio: 'music-note', video: 'camera-video' };
        return icons[category] || 'file';
    }

    static getValidationScore() {
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
}
