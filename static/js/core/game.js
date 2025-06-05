class GameCore {
    constructor() {
        this.currentRoom = null;
        this.currentChallenge = null;
        this.progress = this.loadProgress();
        this.inventory = this.loadInventory();
        
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
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.game = new GameCore();
});
