class GameEngine {
    constructor() {
        this.currentRoom = 'server-room';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadGameState();
        this.updateUI();
    }

    setupEventListeners() {
        // Room navigation
        document.querySelectorAll('.room-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const roomId = e.target.closest('.room-btn').dataset.room;
                if (!e.target.closest('.room-btn').disabled) {
                    this.switchRoom(roomId);
                }
            });
        });

        // Challenge interactions - navigate to dedicated pages
        document.querySelectorAll('.interactable').forEach(element => {
            element.addEventListener('click', (e) => {
                const challengeType = e.currentTarget.dataset.challenge;
                this.navigateToChallenge(challengeType);
            });
        });

        // Panel toggles
        document.getElementById('inventory-btn').addEventListener('click', () => {
            this.togglePanel('inventory');
        });

        document.getElementById('progress-btn').addEventListener('click', () => {
            this.togglePanel('progress');
        });

        document.getElementById('hint-btn').addEventListener('click', () => {
            this.togglePanel('hints');
        });
    }

    switchRoom(roomId) {
        // Hide current room
        document.querySelectorAll('.room').forEach(room => {
            room.classList.remove('active');
        });

        // Show new room
        document.getElementById(roomId).classList.add('active');

        // Update navigation
        document.querySelectorAll('.room-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-room="${roomId}"]`).classList.add('active');

        this.currentRoom = roomId;
        this.saveGameState();
    }    navigateToChallenge(challengeType) {
        // Save current state before navigation
        this.saveGameState();
        // Navigate to the dedicated challenge page
        const challengePages = {
            'coding': 'challenges/coding/fix-the-array-length-function.html',
            'networking': 'challenges/networking/build-the-network-topology-challenge.html',
            'security-cipher': 'challenges/security/cipher-decoder.html',
            'security-threats': 'challenges/security/threat-detection.html',
            'hardware': 'challenges/hardware/system-diagnostics-and-repair.html',
            'ai': 'challenges/ai/ai-challenge.html'
        };
        
        // Handle security challenges - show selection menu
        if (challengeType === 'security') {
            this.showSecurityChallengeMenu();
            return;
        }
        
        if (challengePages[challengeType]) {
            window.location.href = challengePages[challengeType];
        }
    }

    showSecurityChallengeMenu() {
        // Create a modal or overlay to choose between cipher decoder and threat detection
        const overlay = document.createElement('div');
        overlay.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        overlay.innerHTML = `
            <div class="bg-gray-800 border border-red-600 rounded-lg p-6 max-w-md w-full mx-4">
                <h3 class="text-xl font-bold text-red-400 mb-4">
                    <i class="bi bi-shield-lock"></i> Security Console
                </h3>
                <p class="text-gray-300 mb-6">Choose your security challenge:</p>
                
                <div class="space-y-3">
                    <button onclick="window.game.navigateToSecurityChallenge('security-cipher')" 
                            class="w-full bg-red-600 hover:bg-red-700 p-3 rounded text-left">
                        <i class="bi bi-key mr-2"></i> Cipher Decoder
                        <div class="text-sm text-gray-300">Decrypt intercepted messages</div>
                    </button>
                    
                    <button onclick="window.game.navigateToSecurityChallenge('security-threats')" 
                            class="w-full bg-red-600 hover:bg-red-700 p-3 rounded text-left">
                        <i class="bi bi-bug mr-2"></i> Threat Detection
                        <div class="text-sm text-gray-300">Identify security vulnerabilities</div>
                    </button>
                </div>
                
                <button onclick="this.parentElement.parentElement.remove()" 
                        class="mt-4 w-full bg-gray-600 hover:bg-gray-700 p-2 rounded">
                    Cancel
                </button>
            </div>
        `;
        
        document.body.appendChild(overlay);
    }

    navigateToSecurityChallenge(challengeType) {
        // Remove the overlay
        document.querySelector('.fixed.inset-0').remove();
        // Navigate to the specific security challenge
        this.navigateToChallenge(challengeType);
    }

    togglePanel(panelType) {
        const sidePanel = document.getElementById('side-panel');
        const currentPanel = sidePanel.dataset.panel;

        if (currentPanel === panelType && !sidePanel.classList.contains('hidden')) {
            sidePanel.classList.add('hidden');
            return;
        }

        sidePanel.dataset.panel = panelType;
        sidePanel.classList.remove('hidden');

        switch(panelType) {
            case 'inventory':
                Inventory.render(sidePanel);
                break;
            case 'progress':
                Progress.render(sidePanel);
                break;
            case 'hints':
                Hints.render(sidePanel);
                break;
        }
    }

    completeChallenge(challengeType, reward) {
        Progress.addCompletion(challengeType);
        if (reward.item) {
            Inventory.addItem(reward.item);
        }
        if (reward.unlock) {
            this.unlockRoom(reward.unlock);
        }
        this.saveGameState();
    }

    unlockRoom(roomId) {
        const roomBtn = document.querySelector(`[data-room="${roomId}"]`);
        if (roomBtn) {
            roomBtn.disabled = false;
            roomBtn.classList.add('pulse-glow');
        }
    }

    saveGameState() {
        const gameState = {
            currentRoom: this.currentRoom,
            progress: Progress.getData(),
            inventory: Inventory.getData(),
            timestamp: Date.now()
        };
        localStorage.setItem('ascended-game-state', JSON.stringify(gameState));
    }

    loadGameState() {
        const saved = localStorage.getItem('ascended-game-state');
        if (saved) {
            try {
                const gameState = JSON.parse(saved);
                Progress.loadData(gameState.progress);
                Inventory.loadData(gameState.inventory);
                
                // Unlock rooms based on progress
                this.updateUnlockedRooms();
            } catch (e) {
                console.error('Failed to load game state:', e);
            }
        }
    }

    updateUnlockedRooms() {
        const completions = Progress.getCompletions();
        if (completions >= 2) {
            this.unlockRoom('ai-lab');
        }
        if (completions >= 4) {
            this.unlockRoom('dev-station');
        }
    }

    updateUI() {
        // Update any global UI elements
        this.updateUnlockedRooms();
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.game = new GameEngine();
});
