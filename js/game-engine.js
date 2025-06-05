class GameEngine {
    constructor() {
        this.currentRoom = 'server-room';
        this.challengeActive = false;
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

        // Challenge interactions
        document.querySelectorAll('.interactable').forEach(element => {
            element.addEventListener('click', (e) => {
                const challengeType = e.currentTarget.dataset.challenge;
                this.startChallenge(challengeType);
            });
        });

        // Modal controls
        document.getElementById('close-challenge').addEventListener('click', () => {
            this.closeChallenge();
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

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.challengeActive) {
                this.closeChallenge();
            }
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
    }

    startChallenge(challengeType) {
        this.challengeActive = true;
        const modal = document.getElementById('challenge-modal');
        const title = document.getElementById('challenge-title');
        const content = document.getElementById('challenge-content');

        // Load challenge based on type
        switch(challengeType) {
            case 'coding':
                CodingChallenge.load(title, content);
                break;
            case 'networking':
                NetworkingChallenge.load(title, content);
                break;
            case 'security':
                SecurityChallenge.load(title, content);
                break;
            case 'hardware':
                HardwareChallenge.load(title, content);
                break;
            case 'ai':
                AIChallenge.load(title, content);
                break;
        }

        modal.classList.remove('hidden');
    }

    closeChallenge() {
        this.challengeActive = false;
        document.getElementById('challenge-modal').classList.add('hidden');
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
        this.showCompletionMessage(reward);
    }

    unlockRoom(roomId) {
        const roomBtn = document.querySelector(`[data-room="${roomId}"]`);
        if (roomBtn) {
            roomBtn.disabled = false;
            roomBtn.classList.add('pulse-glow');
        }
    }

    showCompletionMessage(reward) {
        // Create notification
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-green-600 text-white p-4 rounded shadow-lg z-50 slide-in';
        notification.innerHTML = `
            <div class="flex items-center">
                <i class="bi bi-check-circle mr-2"></i>
                <div>
                    <div class="font-bold">Challenge Complete!</div>
                    <div class="text-sm">${reward.message}</div>
                </div>
            </div>
        `;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
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
