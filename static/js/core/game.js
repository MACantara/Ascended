class GameCore {
    constructor() {
        this.currentRoom = null;
        this.currentChallenge = null;
        this.progress = this.loadProgress();
        this.inventory = this.loadInventory();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadRooms();
    }

    setupEventListeners() {
        document.getElementById('inventory-btn')?.addEventListener('click', () => {
            this.showInventory();
        });
        
        document.getElementById('progress-btn')?.addEventListener('click', () => {
            this.showProgress();
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
            this.displayRooms(rooms);
        } catch (error) {
            console.error('Failed to load rooms:', error);
        }
    }

    displayRooms(rooms) {
        const roomList = document.getElementById('room-list');
        if (!roomList) return;

        roomList.innerHTML = '';
        rooms.forEach(room => {
            const isUnlocked = this.progress.unlockedRooms.includes(room.id);
            const roomElement = document.createElement('div');
            roomElement.className = `p-3 rounded cursor-pointer ${
                isUnlocked ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-600 opacity-50'
            }`;
            roomElement.innerHTML = `
                <i class="bi bi-${room.icon}"></i>
                <span class="ml-2">${room.name}</span>
                ${!isUnlocked ? '<i class="bi bi-lock float-right"></i>' : ''}
            `;
            
            if (isUnlocked) {
                roomElement.addEventListener('click', () => this.enterRoom(room.id));
            }
            
            roomList.appendChild(roomElement);
        });
    }

    async enterRoom(roomId) {
        try {
            const response = await fetch(`/api/game/room/${roomId}`);
            const roomData = await response.json();
            this.currentRoom = roomData;
            this.displayRoom(roomData);
        } catch (error) {
            console.error('Failed to load room:', error);
        }
    }

    displayRoom(roomData) {
        const roomContent = document.getElementById('room-content');
        if (!roomContent) return;

        roomContent.innerHTML = `
            <h2 class="text-3xl font-bold mb-4">
                <i class="bi bi-${roomData.icon}"></i> ${roomData.name}
            </h2>
            <p class="text-gray-300 mb-6">${roomData.description}</p>
            <div class="grid md:grid-cols-2 gap-4">
                ${roomData.challenges.map(challenge => `
                    <div class="challenge-card bg-gray-700 p-4 rounded-lg cursor-pointer hover:bg-gray-600" 
                         data-challenge="${challenge.id}" data-type="${challenge.type}">
                        <h4 class="font-bold mb-2">${challenge.title}</h4>
                        <p class="text-sm text-gray-400 mb-2">${challenge.description}</p>
                        <div class="flex justify-between items-center">
                            <span class="text-xs text-blue-400">Difficulty: ${challenge.difficulty}</span>
                            ${this.progress.completedChallenges.includes(challenge.id) ? 
                                '<i class="bi bi-check-circle text-green-400"></i>' : ''}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

        // Add click listeners to challenges
        roomContent.querySelectorAll('.challenge-card').forEach(card => {
            card.addEventListener('click', () => {
                const challengeId = card.dataset.challenge;
                const challengeType = card.dataset.type;
                this.startChallenge(challengeType, challengeId);
            });
        });
    }

    showInventory() {
        const modal = document.getElementById('inventory-modal');
        const itemsContainer = document.getElementById('inventory-items');
        
        itemsContainer.innerHTML = this.inventory.length ? 
            this.inventory.map(item => `
                <div class="flex items-center p-2 bg-gray-700 rounded">
                    <i class="bi bi-${item.icon} mr-3"></i>
                    <div>
                        <div class="font-bold">${item.name}</div>
                        <div class="text-sm text-gray-400">${item.description}</div>
                    </div>
                </div>
            `).join('') : 
            '<p class="text-gray-400">Your inventory is empty. Complete challenges to earn tools!</p>';
        
        modal.classList.remove('hidden');
    }

    showProgress() {
        // Implementation for progress modal
        console.log('Progress:', this.progress);
    }
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.game = new GameCore();
});
