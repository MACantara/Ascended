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
    }

    navigateToChallenge(challengeType) {
        // Save current state before navigation
        this.saveGameState();
        // Navigate to the dedicated challenge page
        const challengePages = {
            'coding': 'challenges/coding/fix-the-array-length-function.html',
            'networking': 'challenges/networking/build-the-network-topology-challenge.html',
            'security': 'challenges/security/security-challenge.html',
            'hardware': 'challenges/hardware/system-diagnostics-and-repair.html',
            'ai': 'challenges/ai/ai-challenge.html'
        };
        
        if (challengePages[challengeType]) {
            window.location.href = challengePages[challengeType];
        }
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
