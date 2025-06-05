class InventoryManager {
    constructor(game) {
        this.game = game;
        this.tools = {
            'debugger': {
                name: 'Code Debugger',
                icon: 'bug',
                description: 'Helps identify errors in code'
            },
            'ethernet_cable': {
                name: 'Ethernet Cable',
                icon: 'ethernet',
                description: 'Connect network devices'
            },
            'encryption_key': {
                name: 'Encryption Key',
                icon: 'key',
                description: 'Decrypt secure messages'
            },
            'cpu_chip': {
                name: 'CPU Chip',
                icon: 'cpu',
                description: 'Process computer instructions'
            },
            'neural_network': {
                name: 'Neural Network',
                icon: 'diagram-3',
                description: 'Train AI models'
            }
        };
    }

    addTool(toolId) {
        if (this.tools[toolId] && !this.game.inventory.find(item => item.id === toolId)) {
            const tool = { id: toolId, ...this.tools[toolId] };
            this.game.inventory.push(tool);
            this.game.saveInventory();
            this.updateInventoryDisplay();
            this.showToolNotification(tool);
        }
    }

    removeTool(toolId) {
        const index = this.game.inventory.findIndex(item => item.id === toolId);
        if (index !== -1) {
            this.game.inventory.splice(index, 1);
            this.game.saveInventory();
            this.updateInventoryDisplay();
        }
    }

    hasTool(toolId) {
        return this.game.inventory.some(item => item.id === toolId);
    }

    updateInventoryDisplay() {
        this.updateQuickInventory();
        this.updateFullInventory();
    }

    updateQuickInventory() {
        const quickInventory = document.getElementById('quick-inventory');
        if (!quickInventory) return;

        const recentTools = this.game.inventory.slice(-3); // Show last 3 tools
        quickInventory.innerHTML = recentTools.length ? 
            recentTools.map(tool => `
                <div class="flex items-center p-1 bg-gray-700 rounded text-xs">
                    <i class="bi bi-${tool.icon} mr-1"></i>
                    <span class="truncate">${tool.name}</span>
                </div>
            `).join('') : 
            '<p class="text-xs text-gray-400">No tools yet</p>';
    }

    updateFullInventory() {
        const itemsContainer = document.getElementById('inventory-items');
        if (!itemsContainer) return;

        itemsContainer.innerHTML = this.game.inventory.length ? 
            this.game.inventory.map(item => `
                <div class="flex items-center p-2 bg-gray-700 rounded">
                    <i class="bi bi-${item.icon} mr-3 text-blue-400"></i>
                    <div class="flex-1">
                        <div class="font-bold text-sm">${item.name}</div>
                        <div class="text-xs text-gray-400">${item.description}</div>
                    </div>
                    <button class="text-red-400 hover:text-red-300 ml-2" 
                            onclick="window.game.inventory.removeTool('${item.id}')">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            `).join('') : 
            '<p class="text-gray-400">Your inventory is empty. Complete challenges to earn tools!</p>';
    }

    showToolNotification(tool) {
        // Create temporary notification
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-green-600 text-white p-4 rounded-lg shadow-lg z-50 animate-pulse';
        notification.innerHTML = `
            <div class="flex items-center">
                <i class="bi bi-${tool.icon} mr-2"></i>
                <div>
                    <div class="font-bold">Tool Acquired!</div>
                    <div class="text-sm">${tool.name}</div>
                </div>
            </div>
        `;

        document.body.appendChild(notification);

        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    canUseTool(toolId, challengeType) {
        // Define tool compatibility with challenge types
        const compatibility = {
            'debugger': ['coding'],
            'ethernet_cable': ['networking'],
            'encryption_key': ['cybersecurity'],
            'cpu_chip': ['hardware'],
            'neural_network': ['ai']
        };

        return this.hasTool(toolId) && 
               compatibility[toolId] && 
               compatibility[toolId].includes(challengeType);
    }

    useTool(toolId, challengeId) {
        if (!this.hasTool(toolId)) return false;

        // Tool usage logic - could provide hints, skip steps, etc.
        console.log(`Using tool ${toolId} on challenge ${challengeId}`);
        
        // For now, just show a message
        const tool = this.game.inventory.find(item => item.id === toolId);
        if (tool) {
            this.showToolUsageMessage(tool);
        }

        return true;
    }

    showToolUsageMessage(tool) {
        const message = document.createElement('div');
        message.className = 'fixed bottom-4 left-4 bg-blue-600 text-white p-3 rounded shadow-lg z-50';
        message.innerHTML = `
            <div class="flex items-center">
                <i class="bi bi-${tool.icon} mr-2"></i>
                <span>Using ${tool.name}...</span>
            </div>
        `;

        document.body.appendChild(message);

        setTimeout(() => {
            message.remove();
        }, 2000);
    }
}
