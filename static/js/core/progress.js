class ProgressManager {
    constructor(game) {
        this.game = game;
        this.badges = [];
        this.loadBadges();
    }

    async loadBadges() {
        try {
            const response = await fetch('/api/progress/badges');
            if (response.ok) {
                this.badges = await response.json();
            }
        } catch (error) {
            console.error('Failed to load badges:', error);
        }
    }

    completeChallenge(challengeId, challengeType) {
        if (!this.game.progress.completedChallenges.includes(challengeId)) {
            this.game.progress.completedChallenges.push(challengeId);
            this.game.progress.totalScore += this.getScoreForChallenge(challengeType);
            this.checkForNewBadges();
            this.checkForRoomUnlocks();
            this.game.saveProgress();
        }
    }

    getScoreForChallenge(challengeType) {
        const baseScores = {
            'coding': 10,
            'cybersecurity': 15,
            'networking': 12,
            'hardware': 8,
            'ai': 20
        };
        return baseScores[challengeType] || 5;
    }

    checkForNewBadges() {
        const completed = this.game.progress.completedChallenges;
        const currentBadges = this.game.progress.badges;

        // Check for Debug Hero badge
        if (!currentBadges.includes('debug_hero')) {
            const codingChallenges = completed.filter(id => id.startsWith('coding')).length;
            if (codingChallenges >= 5) {
                this.awardBadge('debug_hero');
            }
        }

        // Check for Crypto Cracker badge
        if (!currentBadges.includes('crypto_cracker')) {
            const cryptoChallenges = completed.filter(id => id.startsWith('cyber')).length;
            if (cryptoChallenges >= 3) {
                this.awardBadge('crypto_cracker');
            }
        }

        // Check for Network Ninja badge
        if (!currentBadges.includes('network_ninja')) {
            const networkChallenges = completed.filter(id => id.startsWith('network')).length;
            if (networkChallenges >= 4) {
                this.awardBadge('network_ninja');
            }
        }

        // Check for Hardware Hero badge
        if (!currentBadges.includes('hardware_hero')) {
            const hardwareChallenges = completed.filter(id => id.startsWith('hardware')).length;
            if (hardwareChallenges >= 3) {
                this.awardBadge('hardware_hero');
            }
        }

        // Check for AI Architect badge
        if (!currentBadges.includes('ai_architect')) {
            const aiChallenges = completed.filter(id => id.startsWith('ai')).length;
            if (aiChallenges >= 2) {
                this.awardBadge('ai_architect');
            }
        }
    }

    awardBadge(badgeId) {
        this.game.progress.badges.push(badgeId);
        const badge = this.badges.find(b => b.id === badgeId);
        if (badge) {
            this.showBadgeNotification(badge);
        }
    }

    showBadgeNotification(badge) {
        const notification = document.createElement('div');
        notification.className = 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-yellow-600 text-white p-6 rounded-lg shadow-2xl z-50 animate-bounce';
        notification.innerHTML = `
            <div class="text-center">
                <i class="bi bi-trophy text-4xl mb-2"></i>
                <h3 class="text-xl font-bold mb-2">Badge Earned!</h3>
                <h4 class="text-lg font-bold">${badge.name}</h4>
                <p class="text-sm">${badge.description}</p>
                <button class="mt-4 bg-yellow-700 hover:bg-yellow-800 px-4 py-2 rounded" 
                        onclick="this.parentElement.parentElement.remove()">
                    Awesome!
                </button>
            </div>
        `;

        document.body.appendChild(notification);
    }

    checkForRoomUnlocks() {
        const completed = this.game.progress.completedChallenges;
        const unlocked = this.game.progress.unlockedRooms;

        // Unlock cybersecurity after completing basic coding
        if (!unlocked.includes('cybersecurity') && 
            completed.some(id => id.startsWith('coding'))) {
            this.unlockRoom('cybersecurity');
        }

        // Unlock networking after completing basic coding
        if (!unlocked.includes('networking') && 
            completed.some(id => id.startsWith('coding'))) {
            this.unlockRoom('networking');
        }

        // Unlock hardware after completing networking
        if (!unlocked.includes('hardware') && 
            completed.some(id => id.startsWith('network'))) {
            this.unlockRoom('hardware');
        }

        // Unlock AI after completing hardware
        if (!unlocked.includes('ai') && 
            completed.some(id => id.startsWith('hardware'))) {
            this.unlockRoom('ai');
        }
    }

    unlockRoom(roomId) {
        this.game.progress.unlockedRooms.push(roomId);
        this.showRoomUnlockNotification(roomId);
        
        // Refresh room list
        if (this.game.roomManager) {
            this.game.loadRooms();
        }
    }

    showRoomUnlockNotification(roomId) {
        const roomNames = {
            'cybersecurity': 'Security Center',
            'networking': 'Network Hub',
            'hardware': 'Hardware Workshop',
            'ai': 'AI Research Lab'
        };

        const notification = document.createElement('div');
        notification.className = 'fixed top-4 left-4 bg-purple-600 text-white p-4 rounded-lg shadow-lg z-50';
        notification.innerHTML = `
            <div class="flex items-center">
                <i class="bi bi-unlock mr-2"></i>
                <div>
                    <div class="font-bold">New Area Unlocked!</div>
                    <div class="text-sm">${roomNames[roomId] || roomId}</div>
                </div>
            </div>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 4000);
    }

    getProgressSummary() {
        return {
            totalChallenges: this.game.progress.completedChallenges.length,
            totalScore: this.game.progress.totalScore,
            badges: this.game.progress.badges.length,
            unlockedRooms: this.game.progress.unlockedRooms.length
        };
    }

    showProgressModal() {
        const summary = this.getProgressSummary();
        
        // Create and show progress modal
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4';
        modal.innerHTML = `
            <div class="bg-gray-800 rounded-lg p-6 max-w-md w-full">
                <h3 class="text-2xl font-bold mb-4 text-center">Your Progress</h3>
                
                <div class="grid grid-cols-2 gap-4 mb-6">
                    <div class="text-center">
                        <div class="text-3xl font-bold text-blue-400">${summary.totalChallenges}</div>
                        <div class="text-sm text-gray-400">Challenges Completed</div>
                    </div>
                    <div class="text-center">
                        <div class="text-3xl font-bold text-green-400">${summary.totalScore}</div>
                        <div class="text-sm text-gray-400">Total Score</div>
                    </div>
                    <div class="text-center">
                        <div class="text-3xl font-bold text-yellow-400">${summary.badges}</div>
                        <div class="text-sm text-gray-400">Badges Earned</div>
                    </div>
                    <div class="text-center">
                        <div class="text-3xl font-bold text-purple-400">${summary.unlockedRooms}</div>
                        <div class="text-sm text-gray-400">Areas Unlocked</div>
                    </div>
                </div>

                <div class="mb-4">
                    <h4 class="font-bold mb-2">Recent Badges:</h4>
                    <div class="space-y-1">
                        ${this.game.progress.badges.slice(-3).map(badgeId => {
                            const badge = this.badges.find(b => b.id === badgeId);
                            return badge ? `
                                <div class="flex items-center p-2 bg-gray-700 rounded">
                                    <i class="bi bi-trophy mr-2 text-yellow-400"></i>
                                    <span class="text-sm">${badge.name}</span>
                                </div>
                            ` : '';
                        }).join('') || '<p class="text-gray-400 text-sm">No badges yet</p>'}
                    </div>
                </div>

                <button class="w-full bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded" 
                        onclick="this.parentElement.parentElement.remove()">
                    Close
                </button>
            </div>
        `;

        document.body.appendChild(modal);
    }
}
