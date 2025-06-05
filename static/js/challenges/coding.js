class CodingChallenge {
    constructor(challengeData, game) {
        this.data = challengeData;
        this.game = game;
        this.userSolution = [];
        this.executionSteps = [];
        this.currentStep = 0;
        this.isExecuting = false;
        this.robot = {
            x: 0,
            y: 0,
            direction: 'right',
            collected: 0,
            target: 0
        };
        this.init();
    }

    init() {
        // Don't setup immediately, wait for DOM to be ready
        setTimeout(() => {
            this.setupGameMechanics();
            this.startStoryNarration();
        }, 100);
    }

    render() {
        return `
            <div class="coding-game-challenge">
                <!-- Story Header -->
                <div class="bg-gradient-to-r from-purple-600 to-blue-600 p-4 rounded-lg mb-4">
                    <div class="flex items-center mb-2">
                        <i class="bi bi-robot text-2xl mr-2"></i>
                        <h4 class="font-bold text-lg">${this.data.story?.title || 'Code the Robot'}</h4>
                    </div>
                    <p class="text-sm text-blue-100" id="story-text">
                        ${this.data.story?.intro || 'Help the robot complete its mission by programming its movements!'}
                    </p>
                </div>

                <!-- Game Stats -->
                <div class="grid grid-cols-3 gap-2 mb-4 text-xs">
                    <div class="bg-gray-700 p-2 rounded text-center">
                        <div class="text-green-400 font-bold" id="streak-display">0</div>
                        <div class="text-gray-400">Streak</div>
                    </div>
                    <div class="bg-gray-700 p-2 rounded text-center">
                        <div class="text-blue-400 font-bold" id="combo-display">x1.0</div>
                        <div class="text-gray-400">Multiplier</div>
                    </div>
                    <div class="bg-gray-700 p-2 rounded">
                        <div class="text-gray-400 text-xs mb-1">Energy</div>
                        <div class="bg-gray-600 rounded-full h-2">
                            <div id="energy-bar" class="h-full bg-green-500 rounded-full transition-all duration-300" style="width: 100%"></div>
                        </div>
                    </div>
                </div>

                <!-- Visual Game World -->
                <div class="mb-4">
                    <h4 class="font-bold mb-2 flex items-center">
                        <i class="bi bi-grid-3x3 mr-1"></i> Mission Control
                    </h4>
                    <div id="game-world" class="bg-gray-800 border-2 border-gray-600 rounded-lg p-2 grid grid-cols-5 gap-1 h-48">
                        ${this.renderGameGrid()}
                    </div>
                </div>

                <!-- Command Palette -->
                <div class="mb-4">
                    <h4 class="font-bold mb-2 flex items-center">
                        <i class="bi bi-joystick mr-1"></i> Command Blocks
                        <button id="help-btn" class="ml-2 text-xs bg-blue-600 px-2 py-1 rounded">
                            <i class="bi bi-question-circle"></i> Help
                        </button>
                    </h4>
                    <div id="command-blocks" class="grid grid-cols-2 gap-2">
                        ${this.renderCommandBlocks()}
                    </div>
                </div>

                <!-- Programming Area -->
                <div class="mb-4">
                    <h4 class="font-bold mb-2 flex items-center justify-between">
                        <span><i class="bi bi-code-slash mr-1"></i> Your Program</span>
                        <div class="flex space-x-1">
                            <button id="clear-btn" class="text-xs bg-red-600 px-2 py-1 rounded">
                                <i class="bi bi-trash"></i> Clear
                            </button>
                            <button id="execute-btn" class="text-xs bg-green-600 px-2 py-1 rounded">
                                <i class="bi bi-play"></i> Execute
                            </button>
                        </div>
                    </h4>
                    <div id="program-area" class="min-h-24 bg-gray-800 border-2 border-dashed border-gray-500 p-3 rounded-lg">
                        <div class="text-gray-400 text-center text-sm">Drag command blocks here to build your program</div>
                    </div>
                </div>

                <!-- Execution Console -->
                <div class="mb-4">
                    <h4 class="font-bold mb-2 flex items-center">
                        <i class="bi bi-terminal mr-1"></i> Console Output
                    </h4>
                    <div id="console-output" class="bg-black text-green-400 p-3 rounded font-mono text-xs h-16 overflow-y-auto">
                        <div>Ready to execute program...</div>
                    </div>
                </div>
            </div>
        `;
    }

    renderGameGrid() {
        let grid = '';
        for (let i = 0; i < 25; i++) {
            const x = i % 5;
            const y = Math.floor(i / 5);
            let cellClass = 'bg-gray-700 rounded aspect-square flex items-center justify-center text-lg';
            let content = '';

            // Add game elements based on challenge type
            if (this.data.gameType === 'collect') {
                if (x === 0 && y === 2) {
                    cellClass += ' bg-blue-600';
                    content = '<i class="bi bi-robot text-white"></i>';
                } else if ((x === 2 && y === 1) || (x === 3 && y === 3) || (x === 4 && y === 2)) {
                    cellClass += ' bg-yellow-600';
                    content = '<i class="bi bi-gem text-white"></i>';
                } else if (x === 4 && y === 4) {
                    cellClass += ' bg-green-600';
                    content = '<i class="bi bi-flag text-white"></i>';
                }
            }

            grid += `<div class="${cellClass}" data-x="${x}" data-y="${y}">${content}</div>`;
        }
        return grid;
    }

    renderCommandBlocks() {
        const commands = [
            { id: 'move_right', icon: 'arrow-right', label: 'Move Right', color: 'bg-blue-600' },
            { id: 'move_left', icon: 'arrow-left', label: 'Move Left', color: 'bg-blue-600' },
            { id: 'move_up', icon: 'arrow-up', label: 'Move Up', color: 'bg-blue-600' },
            { id: 'move_down', icon: 'arrow-down', label: 'Move Down', color: 'bg-blue-600' },
            { id: 'collect', icon: 'hand-index', label: 'Collect Item', color: 'bg-yellow-600' },
            { id: 'if_item', icon: 'question-diamond', label: 'If Item Here', color: 'bg-purple-600' },
            { id: 'repeat_3', icon: 'arrow-repeat', label: 'Repeat 3x', color: 'bg-green-600' },
            { id: 'turn_right', icon: 'arrow-clockwise', label: 'Turn Right', color: 'bg-orange-600' }
        ];

        return commands.map(cmd => `
            <div class="command-block ${cmd.color} p-2 rounded cursor-move text-center hover:opacity-80 transition-opacity"
                 draggable="true" data-command="${cmd.id}">
                <i class="bi bi-${cmd.icon} text-lg mb-1"></i>
                <div class="text-xs font-bold">${cmd.label}</div>
            </div>
        `).join('');
    }

    setupGameMechanics() {
        this.setupDragAndDrop();
        this.setupGameControls();
        this.game.updateGameStateDisplay();
    }

    setupDragAndDrop() {
        const solutionArea = document.getElementById('solution-area');
        const codeBlocks = document.querySelectorAll('.code-block');

        if (!solutionArea) {
            console.warn('Solution area not found, retrying...');
            setTimeout(() => this.setupDragAndDrop(), 100);
            return;
        }

        if (!codeBlocks.length) {
            console.warn('Code blocks not found, retrying...');
            setTimeout(() => this.setupDragAndDrop(), 100);
            return;
        }

        codeBlocks.forEach(block => {
            block.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', e.target.dataset.block);
                e.target.style.opacity = '0.5';
            });

            block.addEventListener('dragend', (e) => {
                e.target.style.opacity = '1';
            });
        });

        solutionArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            solutionArea.classList.add('border-blue-400', 'bg-gray-750');
        });

        solutionArea.addEventListener('dragleave', () => {
            solutionArea.classList.remove('border-blue-400', 'bg-gray-750');
        });

        solutionArea.addEventListener('drop', (e) => {
            e.preventDefault();
            const blockIndex = e.dataTransfer.getData('text/plain');
            this.addCommandToProgram(parseInt(blockIndex), this.data);
            solutionArea.classList.remove('border-blue-400', 'bg-gray-750');
        });
    }

    setupGameControls() {
        document.getElementById('execute-btn')?.addEventListener('click', () => {
            this.executeProgram();
        });

        document.getElementById('clear-btn')?.addEventListener('click', () => {
            this.clearProgram();
        });

        document.getElementById('help-btn')?.addEventListener('click', () => {
            this.showGameHelp();
        });
    }

    addCommandToProgram(commandId) {
        const programArea = document.getElementById('program-area');
        
        if (programArea.querySelector('.text-gray-400')) {
            programArea.innerHTML = '';
        }

        const commandInfo = this.getCommandInfo(commandId);
        const commandElement = document.createElement('div');
        commandElement.className = `program-command ${commandInfo.color} p-2 rounded mb-2 flex justify-between items-center animate-fadeIn`;
        commandElement.innerHTML = `
            <div class="flex items-center">
                <i class="bi bi-${commandInfo.icon} mr-2"></i>
                <span class="text-sm font-bold">${commandInfo.label}</span>
            </div>
            <button class="text-red-400 hover:text-red-300 ml-2" onclick="this.parentElement.remove()">
                <i class="bi bi-x"></i>
            </button>
        `;
        
        programArea.appendChild(commandElement);
        this.userSolution.push(commandId);

        // Add visual feedback
        commandElement.addEventListener('click', () => {
            commandElement.classList.add('animate-pulse');
            setTimeout(() => commandElement.classList.remove('animate-pulse'), 1000);
        });
    }

    getCommandInfo(commandId) {
        const commands = {
            'move_right': { icon: 'arrow-right', label: 'Move Right', color: 'bg-blue-600' },
            'move_left': { icon: 'arrow-left', label: 'Move Left', color: 'bg-blue-600' },
            'move_up': { icon: 'arrow-up', label: 'Move Up', color: 'bg-blue-600' },
            'move_down': { icon: 'arrow-down', label: 'Move Down', color: 'bg-blue-600' },
            'collect': { icon: 'hand-index', label: 'Collect Item', color: 'bg-yellow-600' },
            'if_item': { icon: 'question-diamond', label: 'If Item Here', color: 'bg-purple-600' },
            'repeat_3': { icon: 'arrow-repeat', label: 'Repeat 3x', color: 'bg-green-600' },
            'turn_right': { icon: 'arrow-clockwise', label: 'Turn Right', color: 'bg-orange-600' }
        };
        return commands[commandId] || { icon: 'code', label: 'Unknown', color: 'bg-gray-600' };
    }

    async executeProgram() {
        if (this.isExecuting) return;

        this.isExecuting = true;
        const executeBtn = document.getElementById('execute-btn');
        executeBtn.innerHTML = '<i class="bi bi-hourglass-split"></i> Running...';
        executeBtn.disabled = true;

        const consoleOutput = document.getElementById('console-output');
        consoleOutput.innerHTML = '<div class="text-blue-400">🤖 Program execution started...</div>';

        // Reset robot position
        this.robot = { x: 0, y: 2, direction: 'right', collected: 0, target: 3 };
        this.updateRobotPosition();

        // Execute each command with animation
        for (let i = 0; i < this.userSolution.length; i++) {
            const command = this.userSolution[i];
            const result = await this.executeCommand(command, i);
            
            if (!result.success) {
                consoleOutput.innerHTML += `<div class="text-red-400">❌ Error: ${result.message}</div>`;
                this.game.updateGameState('wrong_answer');
                break;
            }
            
            consoleOutput.innerHTML += `<div class="text-green-400">✓ ${result.message}</div>`;
            consoleOutput.scrollTop = consoleOutput.scrollHeight;
            
            // Add delay for visual effect
            await this.delay(800);
        }

        // Check win condition
        const success = this.checkWinCondition();
        if (success) {
            consoleOutput.innerHTML += `<div class="text-yellow-400">🎉 Mission Complete! Robot collected all items!</div>`;
            this.game.updateGameState('correct_answer');
            this.celebrateSuccess();
        } else {
            consoleOutput.innerHTML += `<div class="text-orange-400">🤔 Mission incomplete. Try adjusting your program!</div>`;
        }

        executeBtn.innerHTML = '<i class="bi bi-play"></i> Execute';
        executeBtn.disabled = false;
        this.isExecuting = false;
    }

    async executeCommand(command, step) {
        return new Promise((resolve) => {
            switch (command) {
                case 'move_right':
                    if (this.robot.x < 4) {
                        this.robot.x++;
                        resolve({ success: true, message: `Moved right to (${this.robot.x}, ${this.robot.y})` });
                    } else {
                        resolve({ success: false, message: 'Cannot move right - at boundary!' });
                    }
                    break;
                case 'move_left':
                    if (this.robot.x > 0) {
                        this.robot.x--;
                        resolve({ success: true, message: `Moved left to (${this.robot.x}, ${this.robot.y})` });
                    } else {
                        resolve({ success: false, message: 'Cannot move left - at boundary!' });
                    }
                    break;
                case 'move_up':
                    if (this.robot.y > 0) {
                        this.robot.y--;
                        resolve({ success: true, message: `Moved up to (${this.robot.x}, ${this.robot.y})` });
                    } else {
                        resolve({ success: false, message: 'Cannot move up - at boundary!' });
                    }
                    break;
                case 'move_down':
                    if (this.robot.y < 4) {
                        this.robot.y++;
                        resolve({ success: true, message: `Moved down to (${this.robot.x}, ${this.robot.y})` });
                    } else {
                        resolve({ success: false, message: 'Cannot move down - at boundary!' });
                    }
                    break;
                case 'collect':
                    if (this.isItemAtPosition(this.robot.x, this.robot.y)) {
                        this.robot.collected++;
                        this.removeItemFromGrid(this.robot.x, this.robot.y);
                        resolve({ success: true, message: `Collected item! Total: ${this.robot.collected}` });
                    } else {
                        resolve({ success: false, message: 'No item to collect here!' });
                    }
                    break;
                default:
                    resolve({ success: true, message: `Executed ${command}` });
            }
            this.updateRobotPosition();
        });
    }

    updateRobotPosition() {
        // Clear previous robot position
        document.querySelectorAll('[data-x][data-y]').forEach(cell => {
            const robot = cell.querySelector('.robot-marker');
            if (robot) robot.remove();
        });

        // Add robot to new position
        const targetCell = document.querySelector(`[data-x="${this.robot.x}"][data-y="${this.robot.y}"]`);
        if (targetCell) {
            const robotMarker = document.createElement('div');
            robotMarker.className = 'robot-marker absolute inset-0 bg-blue-500 bg-opacity-80 rounded flex items-center justify-center animate-pulse';
            robotMarker.innerHTML = '<i class="bi bi-robot text-white text-xl"></i>';
            targetCell.style.position = 'relative';
            targetCell.appendChild(robotMarker);
        }
    }

    isItemAtPosition(x, y) {
        const positions = [[2, 1], [3, 3], [4, 2]];
        return positions.some(pos => pos[0] === x && pos[1] === y);
    }

    removeItemFromGrid(x, y) {
        const cell = document.querySelector(`[data-x="${x}"][data-y="${y}"]`);
        if (cell) {
            cell.classList.remove('bg-yellow-600');
            cell.classList.add('bg-gray-600');
            cell.innerHTML = '<i class="bi bi-check text-green-400"></i>';
        }
    }

    checkWinCondition() {
        return this.robot.collected >= 3;
    }

    celebrateSuccess() {
        // Add celebration animation
        const gameWorld = document.getElementById('game-world');
        gameWorld.classList.add('animate-pulse');
        
        // Create floating particles effect
        this.createParticleEffect();
        
        setTimeout(() => {
            gameWorld.classList.remove('animate-pulse');
        }, 2000);
    }

    createParticleEffect() {
        const gameWorld = document.getElementById('game-world');
        for (let i = 0; i < 10; i++) {
            const particle = document.createElement('div');
            particle.className = 'absolute w-2 h-2 bg-yellow-400 rounded-full animate-ping';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 2 + 's';
            
            gameWorld.style.position = 'relative';
            gameWorld.appendChild(particle);
            
            setTimeout(() => particle.remove(), 3000);
        }
    }

    clearProgram() {
        const programArea = document.getElementById('program-area');
        programArea.innerHTML = '<div class="text-gray-400 text-center text-sm">Drag command blocks here to build your program</div>';
        this.userSolution = [];
    }

    showGameHelp() {
        const helpModal = document.createElement('div');
        helpModal.className = 'fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4';
        helpModal.innerHTML = `
            <div class="bg-gray-800 rounded-lg p-6 max-w-md w-full">
                <h3 class="text-xl font-bold mb-4">🤖 How to Play</h3>
                <div class="space-y-3 text-sm">
                    <p><strong>Goal:</strong> Help the robot collect all gems and reach the flag!</p>
                    <p><strong>Controls:</strong> Drag command blocks to build your program, then click Execute.</p>
                    <div class="bg-gray-700 p-2 rounded">
                        <p><strong>Legend:</strong></p>
                        <p>🤖 Robot • 💎 Gems • 🏳 Goal</p>
                    </div>
                    <p><strong>Tips:</strong> Plan your route carefully and use the right commands!</p>
                </div>
                <button class="mt-4 w-full bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded" 
                        onclick="this.parentElement.parentElement.remove()">
                    Got it!
                </button>
            </div>
        `;
        document.body.appendChild(helpModal);
    }

    startStoryNarration() {
        const storyText = document.getElementById('story-text');
        const stories = [
            "🤖 The maintenance robot needs your help to collect system cores scattered around the server room.",
            "⚡ Each core contains critical data that must be retrieved before the system reboots.",
            "🎯 Program the robot's movements carefully - one wrong step could trigger security protocols!"
        ];
        
        let currentStory = 0;
        const narrateStory = () => {
            if (currentStory < stories.length) {
                storyText.textContent = stories[currentStory];
                storyText.classList.add('animate-pulse');
                setTimeout(() => storyText.classList.remove('animate-pulse'), 1000);
                currentStory++;
                setTimeout(narrateStory, 4000);
            }
        };
        
        setTimeout(narrateStory, 2000);
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    validateSolution() {
        return {
            answer: this.userSolution,
            isCorrect: this.checkWinCondition()
        };
    }
}
