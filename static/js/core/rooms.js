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
                            ${this.game.progress.completedChallenges.includes(challenge.id) ? 
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
                this.game.startChallenge(challengeType, challengeId);
            });
        });
    }

    updateRoomList(rooms) {
        const roomList = document.getElementById('room-list');
        if (!roomList) return;

        roomList.innerHTML = '';
        rooms.forEach(room => {
            const isUnlocked = this.game.progress.unlockedRooms.includes(room.id);
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
                roomElement.addEventListener('click', async () => {
                    const roomData = await this.loadRoom(room.id);
                    if (roomData) {
                        this.game.currentRoom = roomData;
                        this.displayRoom(roomData);
                    }
                });
            }
            
            roomList.appendChild(roomElement);
        });
    }
}
