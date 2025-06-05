class Inventory {
    static items = new Map();
    
    static init() {
        if (!this.items.size) {
            this.loadData({});
        }
    }

    static addItem(item) {
        const existing = this.items.get(item.id) || { ...item, quantity: 0 };
        existing.quantity += item.quantity || 1;
        this.items.set(item.id, existing);
    }

    static removeItem(itemId, quantity = 1) {
        const item = this.items.get(itemId);
        if (item && item.quantity >= quantity) {
            item.quantity -= quantity;
            if (item.quantity <= 0) {
                this.items.delete(itemId);
            }
            return true;
        }
        return false;
    }

    static hasItem(itemId, quantity = 1) {
        const item = this.items.get(itemId);
        return item && item.quantity >= quantity;
    }

    static getData() {
        return Object.fromEntries(this.items);
    }

    static loadData(data) {
        this.items.clear();
        Object.entries(data).forEach(([id, item]) => {
            this.items.set(id, item);
        });
    }

    static render(container) {
        container.innerHTML = `
            <div class="slide-in">
                <h3 class="text-xl font-bold mb-4 text-cyan-400">
                    <i class="bi bi-bag"></i> Inventory
                </h3>
                <div class="inventory-grid">
                    ${this.renderItems()}
                </div>
                <div class="mt-4">
                    <h4 class="font-bold mb-2">Tools Available:</h4>
                    <div class="space-y-2 text-sm">
                        ${this.renderToolsList()}
                    </div>
                </div>
            </div>
        `;
    }

    static renderItems() {
        const slots = [];
        const maxSlots = 16;
        
        let slotIndex = 0;
        for (const [id, item] of this.items) {
            if (slotIndex >= maxSlots) break;
            
            slots.push(`
                <div class="inventory-slot" title="${item.name}: ${item.description}">
                    <div class="inventory-item">${item.icon}</div>
                    ${item.quantity > 1 ? `<span class="absolute -top-1 -right-1 bg-cyan-500 text-xs rounded-full w-4 h-4 flex items-center justify-center">${item.quantity}</span>` : ''}
                </div>
            `);
            slotIndex++;
        }
        
        // Fill remaining slots
        for (let i = slotIndex; i < maxSlots; i++) {
            slots.push('<div class="inventory-slot"></div>');
        }
        
        return slots.join('');
    }

    static renderToolsList() {
        if (this.items.size === 0) {
            return '<p class="text-gray-400">No tools collected yet.</p>';
        }

        return Array.from(this.items.values()).map(item => `
            <div class="flex items-center justify-between bg-gray-700 p-2 rounded">
                <div class="flex items-center">
                    <span class="mr-2">${item.icon}</span>
                    <span>${item.name}</span>
                </div>
                <span class="text-cyan-400">x${item.quantity}</span>
            </div>
        `).join('');
    }
}

// Initialize inventory
Inventory.init();
