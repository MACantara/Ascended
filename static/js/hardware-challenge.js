class HardwareChallenge {
    static computerState = {
        power: false,
        components: {
            cpu: { installed: true, working: true },
            ram: { installed: false, working: true },
            gpu: { installed: true, working: true },
            storage: { installed: true, working: false },
            psu: { installed: true, working: true }
        }
    };

    static load(titleElement, contentElement) {
        titleElement.textContent = "Hardware Diagnostics Lab";
        Hints.setChallenge('hardware');
        this.render(contentElement);
    }

    static render(container) {
        container.innerHTML = `
            <div class="puzzle-container">
                <div class="mb-4">
                    <h4 class="text-lg font-bold mb-2">System Diagnostics & Repair</h4>
                    <p class="text-gray-300 mb-4">
                        The computer won't boot properly. Diagnose and fix the hardware issues.
                    </p>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                        <h5 class="font-bold mb-3">Computer Motherboard</h5>
                        <div id="motherboard" class="bg-gradient-to-br from-green-900 to-green-800 border-2 border-green-600 rounded-lg p-6 relative h-80">
                            ${this.renderMotherboard()}
                        </div>
                        
                        <div class="mt-4 flex space-x-2">
                            <button onclick="HardwareChallenge.powerOn()" 
                                    class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded">
                                <i class="bi bi-power"></i> Power On
                            </button>
                            <button onclick="HardwareChallenge.runDiagnostics()" 
                                    class="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded">
                                <i class="bi bi-cpu"></i> Run Diagnostics
                            </button>
                            <button onclick="HardwareChallenge.resetSystem()" 
                                    class="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded">
                                <i class="bi bi-arrow-clockwise"></i> Reset
                            </button>
                        </div>
                    </div>

                    <div>
                        <h5 class="font-bold mb-3">Available Components</h5>
                        <div id="component-shelf" class="bg-gray-800 border border-gray-600 rounded p-4 mb-4">
                            ${this.renderComponentShelf()}
                        </div>

                        <h5 class="font-bold mb-3">System Status</h5>
                        <div id="system-console" class="terminal h-40 overflow-y-auto">
                            <div class="text-gray-400">System ready for diagnostics...</div>
                        </div>

                        <div class="mt-4">
                            <h5 class="font-bold mb-2">Component Status</h5>
                            <div id="component-status" class="space-y-1 text-sm">
                                ${this.renderComponentStatus()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.setupDragAndDrop();
    }

    static renderMotherboard() {
        const slots = [
            { id: 'cpu-socket', name: 'CPU Socket', x: 120, y: 100, component: 'cpu' },
            { id: 'ram-slot1', name: 'RAM Slot 1', x: 200, y: 50, component: 'ram' },
            { id: 'ram-slot2', name: 'RAM Slot 2', x: 200, y: 80, component: null },
            { id: 'gpu-slot', name: 'PCIe x16', x: 80, y: 200, component: 'gpu' },
            { id: 'storage-sata', name: 'SATA', x: 250, y: 150, component: 'storage' },
            { id: 'power-connector', name: '24-pin Power', x: 20, y: 20, component: 'psu' }
        ];

        return slots.map(slot => {
            const hasComponent = this.computerState.components[slot.component]?.installed;
            const isWorking = this.computerState.components[slot.component]?.working;
            
            return `
                <div class="component-slot absolute border-2 border-dashed border-gray-400 rounded w-12 h-8 flex items-center justify-center text-xs cursor-pointer hover:border-white"
                     style="left: ${slot.x}px; top: ${slot.y}px;"
                     data-slot="${slot.id}" data-component="${slot.component}"
                     title="${slot.name}">
                    ${hasComponent ? this.getComponentIcon(slot.component, isWorking) : ''}
                </div>
            `;
        }).join('');
    }

    static renderComponentShelf() {
        const availableComponents = [
            { id: 'spare-ram', name: 'RAM Module', icon: '🧠', type: 'ram' },
            { id: 'spare-ssd', name: 'SSD Drive', icon: '💾', type: 'storage' },
            { id: 'spare-hdd', name: 'HDD Drive', icon: '💿', type: 'storage' }
        ];

        return availableComponents.map(comp => `
            <div class="spare-component bg-gray-700 border border-gray-500 p-3 rounded mb-2 cursor-move hover:bg-gray-600"
                 draggable="true" data-component-type="${comp.type}" data-component-id="${comp.id}">
                <div class="flex items-center">
                    <span class="text-2xl mr-2">${comp.icon}</span>
                    <span class="text-sm">${comp.name}</span>
                </div>
            </div>
        `).join('');
    }

    static renderComponentStatus() {
        return Object.entries(this.computerState.components).map(([key, comp]) => {
            const statusColor = comp.installed && comp.working ? 'text-green-400' : 
                               comp.installed && !comp.working ? 'text-red-400' : 'text-gray-500';
            const statusText = comp.installed ? (comp.working ? 'OK' : 'FAILED') : 'NOT INSTALLED';
            
            return `
                <div class="flex justify-between items-center bg-gray-700 px-2 py-1 rounded">
                    <span>${key.toUpperCase()}</span>
                    <span class="${statusColor}">${statusText}</span>
                </div>
            `;
        }).join('');
    }

    static getComponentIcon(componentType, isWorking) {
        const icons = {
            cpu: isWorking ? '🖥️' : '❌',
            ram: isWorking ? '🧠' : '❌',
            gpu: isWorking ? '🎮' : '❌',
            storage: isWorking ? '💾' : '❌',
            psu: isWorking ? '⚡' : '❌'
        };
        return icons[componentType] || '❓';
    }

    static setupDragAndDrop() {
        // Make spare components draggable
        document.querySelectorAll('.spare-component').forEach(component => {
            component.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', JSON.stringify({
                    id: component.dataset.componentId,
                    type: component.dataset.componentType
                }));
            });
        });

        // Make slots droppable
        document.querySelectorAll('.component-slot').forEach(slot => {
            slot.addEventListener('dragover', (e) => e.preventDefault());
            
            slot.addEventListener('drop', (e) => {
                e.preventDefault();
                const data = JSON.parse(e.dataTransfer.getData('text/plain'));
                this.installComponent(slot.dataset.component, data);
            });

            // Click to remove components
            slot.addEventListener('click', (e) => {
                if (e.target.closest('.component-slot').textContent.trim()) {
                    this.removeComponent(slot.dataset.component);
                }
            });
        });
    }

    static installComponent(slotType, componentData) {
        if (componentData.type === slotType) {
            this.computerState.components[slotType].installed = true;
            this.computerState.components[slotType].working = true;
            
            // Remove component from shelf
            document.querySelector(`[data-component-id="${componentData.id}"]`).remove();
            
            this.updateDisplay();
            this.logMessage(`${slotType.toUpperCase()} installed successfully.`, 'success');
        } else {
            this.logMessage(`Cannot install ${componentData.type} in ${slotType} slot!`, 'error');
        }
    }

    static removeComponent(componentType) {
        this.computerState.components[componentType].installed = false;
        this.updateDisplay();
        this.logMessage(`${componentType.toUpperCase()} removed.`, 'info');
    }

    static powerOn() {
        this.computerState.power = true;
        
        // Check if system can boot
        const issues = this.checkSystemIssues();
        
        if (issues.length === 0) {
            this.logMessage('System booting...', 'info');
            setTimeout(() => {
                this.logMessage('Boot successful! System is running normally.', 'success');
                this.completePuzzle();
            }, 2000);
        } else {
            this.logMessage('Boot failed! Issues detected:', 'error');
            issues.forEach(issue => this.logMessage(`- ${issue}`, 'error'));
        }
    }

    static runDiagnostics() {
        this.logMessage('Running hardware diagnostics...', 'info');
        
        setTimeout(() => {
            Object.entries(this.computerState.components).forEach(([key, comp]) => {
                const status = comp.installed ? (comp.working ? 'PASS' : 'FAIL') : 'NOT FOUND';
                const color = status === 'PASS' ? 'success' : status === 'FAIL' ? 'error' : 'warning';
                this.logMessage(`${key.toUpperCase()}: ${status}`, color);
            });

            const issues = this.checkSystemIssues();
            if (issues.length > 0) {
                this.logMessage('Issues found:', 'warning');
                issues.forEach(issue => this.logMessage(`- ${issue}`, 'warning'));
            } else {
                this.logMessage('All components functioning properly!', 'success');
            }
        }, 1500);
    }

    static checkSystemIssues() {
        const issues = [];
        const components = this.computerState.components;
        
        if (!components.ram.installed) {
            issues.push('RAM not installed - system cannot boot without memory');
        }
        if (components.storage.installed && !components.storage.working) {
            issues.push('Storage device failure - replace faulty drive');
        }
        if (!components.storage.installed) {
            issues.push('No storage device detected');
        }
        
        return issues;
    }

    static resetSystem() {
        this.computerState.power = false;
        this.computerState.components = {
            cpu: { installed: true, working: true },
            ram: { installed: false, working: true },
            gpu: { installed: true, working: true },
            storage: { installed: true, working: false },
            psu: { installed: true, working: true }
        };
        
        this.updateDisplay();
        this.logMessage('System reset to initial state.', 'info');
    }

    static updateDisplay() {
        // Update motherboard display
        document.querySelectorAll('.component-slot').forEach(slot => {
            const componentType = slot.dataset.component;
            const comp = this.computerState.components[componentType];
            
            if (comp && comp.installed) {
                slot.innerHTML = this.getComponentIcon(componentType, comp.working);
            } else {
                slot.innerHTML = '';
            }
        });

        // Update component status
        document.getElementById('component-status').innerHTML = this.renderComponentStatus();
    }

    static logMessage(message, type = 'info') {
        const console = document.getElementById('system-console');
        const colors = {
            info: 'text-blue-400',
            success: 'text-green-400',
            warning: 'text-yellow-400',
            error: 'text-red-400'
        };

        const messageDiv = document.createElement('div');
        messageDiv.className = colors[type] || 'text-gray-400';
        messageDiv.textContent = `> ${message}`;
        
        console.appendChild(messageDiv);
        console.scrollTop = console.scrollHeight;
    }

    static completePuzzle() {
        const reward = {
            item: {
                id: 'diagnostic-tool',
                name: 'Diagnostic Tool',
                icon: '🔧',
                description: 'Advanced hardware diagnostic scanner',
                quantity: 1
            },
            message: 'System repaired! You earned a Diagnostic Tool!',
            unlock: 'ai-lab'
        };
        
        setTimeout(() => {
            window.game.completeChallenge('hardware', reward);
            window.game.closeChallenge();
        }, 2000);
    }
}
