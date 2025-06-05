class GameCore {
    constructor() {
        this.currentRoom = null;
        this.currentChallenge = null;
        this.progress = this.loadProgress();
        this.inventory = this.loadInventory();
        
        // Game state for coding challenges
        this.gameState = {
            energy: 100,
            streak: 0,
            combo: 1,
            debugMode: false
        };
        
        // Initialize managers
        this.roomManager = new RoomManager(this);
        this.challengeManager = new ChallengeManager(this);
        this.inventoryManager = new InventoryManager(this);
        this.progressManager = new ProgressManager(this);
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadRooms();
        this.inventoryManager.updateInventoryDisplay();
    }

    setupEventListeners() {
        document.getElementById('inventory-btn')?.addEventListener('click', () => {
            this.showInventory();
        });
        
        document.getElementById('progress-btn')?.addEventListener('click', () => {
            this.progressManager.showProgressModal();
        });
    }

    loadProgress() {
        const saved = localStorage.getItem('ascended_progress');
        return saved ? JSON.parse(saved) : {
            completedChallenges: [],
            unlockedRooms: ['coding'],
            badges: [],
            totalScore: 0
        };
    }

    saveProgress() {
        localStorage.setItem('ascended_progress', JSON.stringify(this.progress));
    }

    loadInventory() {
        const saved = localStorage.getItem('ascended_inventory');
        return saved ? JSON.parse(saved) : [];
    }

    saveInventory() {
        localStorage.setItem('ascended_inventory', JSON.stringify(this.inventory));
    }

    async loadRooms() {
        try {
            const response = await fetch('/api/game/rooms');
            const rooms = await response.json();
            this.roomManager.updateRoomList(rooms);
        } catch (error) {
            console.error('Failed to load rooms:', error);
        }
    }

    // Fixed: Add missing startChallenge method
    startChallenge(challengeType, challengeId) {
        this.challengeManager.startChallenge(challengeType, challengeId);
    }

    completeChallenge(challengeId) {
        // Determine challenge type from ID (simple approach)
        const challengeType = challengeId.split('_')[0];
        this.progressManager.completeChallenge(challengeId, challengeType);
        
        // Refresh room display to show completion
        if (this.currentRoom) {
            this.roomManager.displayRoom(this.currentRoom);
        }
    }

    addToInventory(toolId) {
        this.inventoryManager.addTool(toolId);
    }

    showInventory() {
        const modal = document.getElementById('inventory-modal');
        this.inventoryManager.updateFullInventory();
        modal.classList.remove('hidden');
    }

    updateGameState(action, value = 1) {
        switch(action) {
            case 'correct_answer':
                this.gameState.streak += 1;
                this.gameState.combo = Math.min(this.gameState.combo + 0.1, 2.0);
                this.gameState.energy = Math.min(this.gameState.energy + 10, 100);
                break;
            case 'wrong_answer':
                this.gameState.streak = 0;
                this.gameState.combo = 1;
                this.gameState.energy = Math.max(this.gameState.energy - 15, 0);
                break;
            case 'use_hint':
                this.gameState.energy = Math.max(this.gameState.energy - 5, 0);
                break;
        }
        this.updateGameStateDisplay();
    }

    updateGameStateDisplay() {
        const energyBar = document.getElementById('energy-bar');
        const streakDisplay = document.getElementById('streak-display');
        const comboDisplay = document.getElementById('combo-display');
        
        if (energyBar) {
            energyBar.style.width = `${this.gameState.energy}%`;
            energyBar.className = `h-full transition-all duration-300 ${
                this.gameState.energy > 60 ? 'bg-green-500' :
                this.gameState.energy > 30 ? 'bg-yellow-500' : 'bg-red-500'
            }`;
        }
        
        if (streakDisplay) {
            streakDisplay.textContent = this.gameState.streak;
            if (this.gameState.streak > 0) {
                streakDisplay.classList.add('animate-pulse');
            } else {
                streakDisplay.classList.remove('animate-pulse');
            }
        }
        
        if (comboDisplay) {
            comboDisplay.textContent = `x${this.gameState.combo.toFixed(1)}`;
        }
    }
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.game = new GameCore();
});
