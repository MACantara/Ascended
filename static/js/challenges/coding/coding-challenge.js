class CodingChallenge {
    static currentPuzzle = 0;
    static puzzles = [];

    static async load(titleElement, contentElement) {
        titleElement.textContent = "Code Terminal - Debug Challenge";
        
        // Load puzzle data
        this.puzzles = await this.loadPuzzleData();
        this.currentPuzzle = 0;
        
        Hints.setChallenge('coding');
        this.render(contentElement);
    }

    static async loadPuzzleData() {
        // In a real app, this would fetch from data/coding-puzzles.json
        return [
            {
                id: 1,
                title: "Fix the Array Length Function",
                description: "This function should return the length of an array, but it's missing some code.",
                code: `function getArrayLength(arr) {
    // TODO: Add safety check for null/undefined
    return arr.length;
}`,
                solution: `function getArrayLength(arr) {
    if (!arr) return 0;
    return arr.length;
}`,
                testCases: [
                    { input: "[1, 2, 3]", expected: "3" },
                    { input: "[]", expected: "0" },
                    { input: "null", expected: "0" }
                ]
            }
        ];
    }

    static render(container) {
        const puzzle = this.puzzles[this.currentPuzzle];
        
        container.innerHTML = `
            <div class="puzzle-container">
                <div class="mb-4">
                    <h4 class="text-lg font-bold mb-2">${puzzle.title}</h4>
                    <p class="text-gray-300 mb-4">${puzzle.description}</p>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                        <h5 class="font-bold mb-2">Code Editor</h5>
                        <textarea id="code-editor" 
                                  class="w-full h-40 bg-gray-900 text-green-400 font-mono text-sm p-3 rounded border border-gray-600 resize-none"
                                  placeholder="Enter your code here...">${puzzle.code}</textarea>
                        
                        <div class="flex space-x-2 mt-2">
                            <button onclick="CodingChallenge.runCode()" 
                                    class="bg-green-600 hover:bg-green-700 px-3 py-2 rounded">
                                <i class="bi bi-play-fill"></i> Run Code
                            </button>
                            <button onclick="CodingChallenge.resetCode()" 
                                    class="bg-gray-600 hover:bg-gray-700 px-3 py-2 rounded">
                                <i class="bi bi-arrow-clockwise"></i> Reset
                            </button>
                            <button onclick="CodingChallenge.checkSolution()" 
                                    class="bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded">
                                <i class="bi bi-check-circle"></i> Submit
                            </button>
                        </div>
                    </div>

                    <div>
                        <h5 class="font-bold mb-2">Test Cases</h5>
                        <div class="bg-gray-900 p-3 rounded border border-gray-600 h-40 overflow-y-auto">
                            <div id="test-results">
                                ${this.renderTestCases(puzzle.testCases)}
                            </div>
                        </div>

                        <div class="mt-4">
                            <h5 class="font-bold mb-2">Console Output</h5>
                            <div id="console-output" class="terminal h-20 overflow-y-auto">
                                <div class="text-gray-400">Ready to run code...</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    static renderTestCases(testCases) {
        return testCases.map((testCase, index) => `
            <div id="test-${index}" class="mb-2 p-2 bg-gray-800 rounded">
                <div class="text-sm">
                    <span class="text-blue-400">Input:</span> ${testCase.input}<br>
                    <span class="text-green-400">Expected:</span> ${testCase.expected}
                    <span id="result-${index}" class="float-right">
                        <i class="bi bi-circle text-gray-500"></i>
                    </span>
                </div>
            </div>
        `).join('');
    }

    static runCode() {
        const code = document.getElementById('code-editor').value;
        const output = document.getElementById('console-output');
        const puzzle = this.puzzles[this.currentPuzzle];

        try {
            // Create a safe evaluation environment
            const func = new Function('return ' + code)();
            
            output.innerHTML = '<div class="text-green-400">Code executed successfully!</div>';
            
            // Run test cases
            puzzle.testCases.forEach((testCase, index) => {
                try {
                    const input = eval(testCase.input);
                    const result = func(input);
                    const expected = testCase.expected;
                    const passed = String(result) === expected;
                    
                    const resultElement = document.getElementById(`result-${index}`);
                    resultElement.innerHTML = passed ? 
                        '<i class="bi bi-check-circle-fill text-green-400"></i>' :
                        '<i class="bi bi-x-circle-fill text-red-400"></i>';
                        
                } catch (e) {
                    const resultElement = document.getElementById(`result-${index}`);
                    resultElement.innerHTML = '<i class="bi bi-exclamation-triangle-fill text-yellow-400"></i>';
                }
            });
            
        } catch (error) {
            output.innerHTML = `<div class="text-red-400">Error: ${error.message}</div>`;
        }
    }

    static resetCode() {
        const puzzle = this.puzzles[this.currentPuzzle];
        document.getElementById('code-editor').value = puzzle.code;
        document.getElementById('console-output').innerHTML = '<div class="text-gray-400">Code reset to original.</div>';
        
        // Reset test results
        puzzle.testCases.forEach((_, index) => {
            document.getElementById(`result-${index}`).innerHTML = '<i class="bi bi-circle text-gray-500"></i>';
        });
    }

    static checkSolution() {
        const code = document.getElementById('code-editor').value;
        const puzzle = this.puzzles[this.currentPuzzle];
        
        try {
            const func = new Function('return ' + code)();
            let allPassed = true;
            
            puzzle.testCases.forEach(testCase => {
                try {
                    const input = eval(testCase.input);
                    const result = func(input);
                    if (String(result) !== testCase.expected) {
                        allPassed = false;
                    }
                } catch (e) {
                    allPassed = false;
                }
            });
            
            if (allPassed) {
                this.completePuzzle();
            } else {
                document.getElementById('console-output').innerHTML = 
                    '<div class="text-yellow-400">Some test cases failed. Check your logic!</div>';
            }
            
        } catch (error) {
            document.getElementById('console-output').innerHTML = 
                `<div class="text-red-400">Code error: ${error.message}</div>`;
        }
    }

    static completePuzzle() {
        document.getElementById('console-output').innerHTML = 
            '<div class="text-green-400 font-bold">🎉 Puzzle completed successfully!</div>';
            
        // Reward player
        const reward = {
            item: {
                id: 'debug-tool',
                name: 'Debug Tool',
                icon: '🔧',
                description: 'Helps identify code issues',
                quantity: 1
            },
            message: 'You earned a Debug Tool!',
            unlock: null
        };
        
        setTimeout(() => {
            window.game.completeChallenge('coding', reward);
            window.game.closeChallenge();
        }, 2000);
    }
}
