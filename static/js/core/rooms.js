class RoomManager {
    constructor(game) {
        this.game = game;
    }

    async loadRoom(roomId) {
        try {
            const response = await fetch(`/api/game/room/${roomId}`);
            if (!response.ok) {
                throw new Error(`Room not found: ${roomId}`);
            }
            const roomData = await response.json();
            return roomData;
        } catch (error) {
            console.error('Failed to load room:', error);
            return null;
        }
    }

    // Add method to load all rooms for lab interface
    async loadAllRooms() {
        try {
            const response = await fetch('/api/game/rooms');
            if (!response.ok) {
                throw new Error('Failed to fetch rooms');
            }
            const rooms = await response.json();
            return rooms;
        } catch (error) {
            console.error('Failed to load all rooms:', error);
            return [];
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
                    <div class="challenge-card bg-gray-700 p-4 rounded-lg cursor-pointer hover:bg-gray-600 transition-all duration-200" 
                         data-challenge="${challenge.id}" data-type="${challenge.type}">
                        <div class="flex justify-between items-start mb-2">
                            <h4 class="font-bold">${challenge.title}</h4>
                            ${this.game.progress.completedChallenges.includes(challenge.id) ? 
                                '<i class="bi bi-check-circle text-green-400"></i>' : 
                                '<i class="bi bi-play-circle text-blue-400"></i>'}
                        </div>
                        <p class="text-sm text-gray-400 mb-3">${challenge.description}</p>
                        <div class="flex justify-between items-center">
                            <span class="text-xs px-2 py-1 rounded bg-${this.getDifficultyColor(challenge.difficulty)}-600">
                                ${challenge.difficulty}
                            </span>
                            <span class="text-xs text-gray-500">Click to start</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

        // Add click listeners - check if we're in lab or game context
        roomContent.querySelectorAll('.challenge-card').forEach(card => {
            card.addEventListener('click', () => {
                const challengeId = card.dataset.challenge;
                const challengeType = card.dataset.type;
                
                // If we're in the lab, navigate to game page
                if (window.location.pathname === '/lab') {
                    window.location.href = `/game?challenge=${challengeType}&id=${challengeId}`;
                } else {
                    // If we're in game, start challenge directly
                    this.game.startChallenge(challengeType, challengeId);
                }
            });
        });
    }

    getDifficultyColor(difficulty) {
        const colors = {
            'Easy': 'green',
            'Medium': 'yellow',
            'Hard': 'red'
        };
        return colors[difficulty] || 'gray';
    }

    async updateRoomList(rooms = null) {
        const roomList = document.getElementById('room-list');
        if (!roomList) {
            console.warn('Room list element not found');
            return;
        }

        // If no rooms provided, fetch them
        if (!rooms) {
            rooms = await this.loadAllRooms();
        }

        if (!rooms || rooms.length === 0) {
            roomList.innerHTML = `
                <div class="text-center text-gray-400 p-4">
                    <i class="bi bi-exclamation-triangle mb-2"></i>
                    <p class="text-sm">No rooms available</p>
                </div>
            `;
            return;
        }

        roomList.innerHTML = '';
        rooms.forEach(room => {
            const isUnlocked = this.game.progress.unlockedRooms.includes(room.id);
            const completedChallenges = this.getCompletedChallengesInRoom(room.id);
            
            const roomElement = document.createElement('div');
            roomElement.className = `mb-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                isUnlocked ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-600 opacity-50'
            }`;
            
            roomElement.innerHTML = `
                <div class="flex items-center justify-between mb-2">
                    <div class="flex items-center">
                        <i class="bi bi-${room.icon} text-lg mr-2"></i>
                        <span class="font-bold">${room.name}</span>
                    </div>
                    ${!isUnlocked ? '<i class="bi bi-lock"></i>' : ''}
                </div>
                <div class="text-xs text-gray-300 mb-1">${room.description || 'Explore this tech domain'}</div>
                ${isUnlocked ? `
                    <div class="text-xs text-blue-200">
                        ${completedChallenges.count} / ${completedChallenges.total} challenges completed
                    </div>
                ` : `
                    <div class="text-xs text-gray-400">
                        Complete previous challenges to unlock
                    </div>
                `}
            `;
            
            if (isUnlocked) {
                roomElement.addEventListener('click', async () => {
                    // Remove active state from other rooms
                    roomList.querySelectorAll('.room-active').forEach(el => {
                        el.classList.remove('room-active', 'bg-blue-500');
                        el.classList.add('bg-blue-600');
                    });
                    
                    // Add active state to clicked room
                    roomElement.classList.add('room-active', 'bg-blue-500');
                    roomElement.classList.remove('bg-blue-600');
                    
                    const roomData = await this.loadRoom(room.id);
                    if (roomData) {
                        this.game.currentRoom = roomData;
                        this.displayRoom(roomData);
                    }
                });
            } else {
                // Show tooltip for locked rooms
                roomElement.title = `Complete ${room.requirements ? room.requirements.join(', ') : 'previous challenges'} to unlock this room`;
            }
            
            roomList.appendChild(roomElement);
        });
    }

    getCompletedChallengesInRoom(roomId) {
        // This would need room data to get total challenges
        // For now, return mock data
        const completed = this.game.progress.completedChallenges.filter(id => 
            id.startsWith(roomId)
        ).length;
        
        const totals = {
            'coding': 3,
            'cybersecurity': 4,
            'networking': 3,
            'hardware': 3,
            'ai': 2
        };
        
        return {
            count: completed,
            total: totals[roomId] || 0
        };
    }
}
