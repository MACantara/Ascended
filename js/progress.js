class Progress {
    static data = {
        completedChallenges: new Set(),
        badges: new Set(),
        stats: {
            totalChallenges: 0,
            hintsUsed: 0,
            timeSpent: 0
        },
        timestamps: {}
    };

    static init() {
        this.loadData({});
    }

    static addCompletion(challengeType) {
        this.data.completedChallenges.add(challengeType);
        this.data.stats.totalChallenges++;
        this.data.timestamps[challengeType] = Date.now();
        this.checkBadges();
    }

    static isCompleted(challengeType) {
        return this.data.completedChallenges.has(challengeType);
    }

    static getCompletions() {
        return this.data.completedChallenges.size;
    }

    static addBadge(badgeId) {
        this.data.badges.add(badgeId);
    }

    static checkBadges() {
        const completions = this.getCompletions();
        
        if (completions >= 1 && !this.data.badges.has('first-steps')) {
            this.addBadge('first-steps');
        }
        if (completions >= 3 && !this.data.badges.has('problem-solver')) {
            this.addBadge('problem-solver');
        }
        if (completions >= 5 && !this.data.badges.has('tech-expert')) {
            this.addBadge('tech-expert');
        }
        if (this.data.stats.hintsUsed === 0 && completions >= 2 && !this.data.badges.has('no-help-needed')) {
            this.addBadge('no-help-needed');
        }
    }

    static useHint() {
        this.data.stats.hintsUsed++;
    }

    static getData() {
        return {
            completedChallenges: Array.from(this.data.completedChallenges),
            badges: Array.from(this.data.badges),
            stats: this.data.stats,
            timestamps: this.data.timestamps
        };
    }

    static loadData(data) {
        this.data.completedChallenges = new Set(data.completedChallenges || []);
        this.data.badges = new Set(data.badges || []);
        this.data.stats = { ...this.data.stats, ...(data.stats || {}) };
        this.data.timestamps = data.timestamps || {};
    }

    static render(container) {
        const badges = this.getBadgeData();
        const completionRate = (this.getCompletions() / 5) * 100;

        container.innerHTML = `
            <div class="slide-in">
                <h3 class="text-xl font-bold mb-4 text-cyan-400">
                    <i class="bi bi-graph-up"></i> Progress
                </h3>
                
                <div class="mb-6">
                    <h4 class="font-bold mb-2">Overall Progress</h4>
                    <div class="progress-bar mb-2">
                        <div class="progress-fill" style="width: ${completionRate}%"></div>
                    </div>
                    <p class="text-sm text-gray-400">${this.getCompletions()}/5 Challenges Complete</p>
                </div>

                <div class="mb-6">
                    <h4 class="font-bold mb-2">Challenge Status</h4>
                    <div class="space-y-2">
                        ${this.renderChallengeStatus()}
                    </div>
                </div>

                <div class="mb-6">
                    <h4 class="font-bold mb-2">Badges Earned</h4>
                    <div class="grid grid-cols-2 gap-2">
                        ${badges.map(badge => `
                            <div class="badge ${badge.earned ? badge.class : 'bg-gray-600 text-gray-400'} text-center">
                                <i class="${badge.icon}"></i> ${badge.name}
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div>
                    <h4 class="font-bold mb-2">Statistics</h4>
                    <div class="space-y-1 text-sm">
                        <div class="flex justify-between">
                            <span>Challenges Completed:</span>
                            <span class="text-cyan-400">${this.data.stats.totalChallenges}</span>
                        </div>
                        <div class="flex justify-between">
                            <span>Hints Used:</span>
                            <span class="text-yellow-400">${this.data.stats.hintsUsed}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    static renderChallengeStatus() {
        const challenges = [
            { id: 'coding', name: 'Code Terminal', icon: 'bi-code-slash' },
            { id: 'networking', name: 'Network Config', icon: 'bi-router' },
            { id: 'security', name: 'Security Console', icon: 'bi-shield-lock' },
            { id: 'hardware', name: 'Hardware Diagnostics', icon: 'bi-motherboard' },
            { id: 'ai', name: 'AI Laboratory', icon: 'bi-robot' }
        ];

        return challenges.map(challenge => {
            const completed = this.isCompleted(challenge.id);
            return `
                <div class="flex items-center justify-between bg-gray-700 p-2 rounded">
                    <div class="flex items-center">
                        <i class="${challenge.icon} mr-2"></i>
                        <span>${challenge.name}</span>
                    </div>
                    <span class="${completed ? 'text-green-400' : 'text-gray-500'}">
                        <i class="bi bi-${completed ? 'check-circle-fill' : 'circle'}"></i>
                    </span>
                </div>
            `;
        }).join('');
    }

    static getBadgeData() {
        return [
            {
                id: 'first-steps',
                name: 'First Steps',
                icon: 'bi-star',
                class: 'badge-bronze',
                earned: this.data.badges.has('first-steps')
            },
            {
                id: 'problem-solver',
                name: 'Problem Solver',
                icon: 'bi-puzzle',
                class: 'badge-silver',
                earned: this.data.badges.has('problem-solver')
            },
            {
                id: 'tech-expert',
                name: 'Tech Expert',
                icon: 'bi-award',
                class: 'badge-gold',
                earned: this.data.badges.has('tech-expert')
            },
            {
                id: 'no-help-needed',
                name: 'Independent',
                icon: 'bi-lightning',
                class: 'badge-gold',
                earned: this.data.badges.has('no-help-needed')
            }
        ];
    }
}

// Initialize progress
Progress.init();
