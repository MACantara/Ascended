class CodingChallenge {
    constructor(challengeData) {
        this.data = challengeData;
        this.userSolution = [];
        this.init();
    }

    init() {
        this.render();
        this.setupDragAndDrop();
    }

    render() {
        return `
            <div class="coding-challenge">
                <div class="mb-4">
                    <h4 class="font-bold mb-2">Problem:</h4>
                    <p class="text-sm text-gray-300">${this.data.problem}</p>
                </div>
                
                <div class="mb-4">
                    <h4 class="font-bold mb-2">Available Code Blocks:</h4>
                    <div id="code-blocks" class="space-y-2">
                        ${this.data.codeBlocks.map((block, index) => `
                            <div class="code-block bg-blue-600 p-2 rounded cursor-move" 
                                 draggable="true" data-block="${index}">
                                <code class="text-sm">${block}</code>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="mb-4">
                    <h4 class="font-bold mb-2">Your Solution:</h4>
                    <div id="solution-area" class="min-h-24 bg-gray-700 border-2 border-dashed border-gray-500 p-4 rounded">
                        <div class="text-gray-400 text-center">Drag code blocks here</div>
                    </div>
                </div>
                
                ${this.data.testCases ? `
                    <div class="mb-4">
                        <h4 class="font-bold mb-2">Test Cases:</h4>
                        <div class="text-sm text-gray-400">
                            ${this.data.testCases.map(test => 
                                `Input: ${test.input} → Expected: ${test.output}`
                            ).join('<br>')}
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }

    setupDragAndDrop() {
        const solutionArea = document.getElementById('solution-area');
        const codeBlocks = document.querySelectorAll('.code-block');

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
            this.addBlockToSolution(parseInt(blockIndex));
            solutionArea.classList.remove('border-blue-400');
        });
    }

    addBlockToSolution(blockIndex) {
        const solutionArea = document.getElementById('solution-area');
        const block = this.data.codeBlocks[blockIndex];
        
        if (solutionArea.querySelector('.text-gray-400')) {
            solutionArea.innerHTML = '';
        }

        const blockElement = document.createElement('div');
        blockElement.className = 'bg-green-600 p-2 rounded mb-2 flex justify-between items-center';
        blockElement.innerHTML = `
            <code class="text-sm">${block}</code>
            <button class="text-red-400 hover:text-red-300" onclick="this.parentElement.remove()">
                <i class="bi bi-x"></i>
            </button>
        `;
        
        solutionArea.appendChild(blockElement);
        this.userSolution.push(block);
    }

    validateSolution() {
        const currentSolution = Array.from(document.querySelectorAll('#solution-area code'))
            .map(code => code.textContent);
        
        return {
            answer: currentSolution,
            isCorrect: JSON.stringify(currentSolution) === JSON.stringify(this.data.solution)
        };
    }
}
