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
                <div class="mb-6">
                    <h4 class="text-2xl font-bold mb-3 text-green-400 flex items-center">
                        <i class="bi bi-tools mr-3 text-3xl"></i>
                        System Diagnostics & Repair
                    </h4>
                    <p class="text-gray-300 mb-4 text-lg">
                        🔧 The computer won't boot properly. Use your diagnostic skills to identify and fix the hardware issues.
                    </p>
                    <div class="bg-yellow-900 border-l-4 border-yellow-400 p-4 rounded">
                        <div class="flex">
                            <i class="bi bi-exclamation-triangle text-yellow-400 mr-2"></i>
                            <span class="text-yellow-200">System Status: Boot Failure Detected</span>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    <!-- Motherboard Section -->
                    <div class="xl:col-span-2">
                        <div class="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl overflow-hidden">
                            <div class="bg-gradient-to-r from-green-600 to-green-700 p-4">
                                <h5 class="font-bold text-xl flex items-center">
                                    <i class="bi bi-motherboard mr-2"></i>
                                    Computer Motherboard
                                    <div class="ml-auto flex items-center space-x-2">
                                        <div id="power-indicator" class="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
                                        <span class="text-sm">Power: OFF</span>
                                    </div>
                                </h5>
                            </div>
                            
                            <div id="motherboard" class="relative h-96 p-6 bg-gradient-to-br from-green-900 via-green-800 to-green-900 border-4 border-green-600 rounded-b-xl motherboard-bg">
                                <!-- Circuit pattern overlay -->
                                <div class="absolute inset-0 opacity-20 pointer-events-none">
                                    <svg class="w-full h-full" viewBox="0 0 400 400">
                                        <defs>
                                            <pattern id="circuit" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                                                <path d="M0 20h40M20 0v40" stroke="#10b981" stroke-width="1" opacity="0.3"/>
                                                <circle cx="20" cy="20" r="2" fill="#10b981" opacity="0.5"/>
                                            </pattern>
                                        </defs>
                                        <rect width="100%" height="100%" fill="url(#circuit)"/>
                                    </svg>
                                </div>
                                ${this.renderMotherboard()}
                            </div>
                        </div>
                        
                        <div class="mt-6 flex flex-wrap gap-3">
                            <button onclick="HardwareChallenge.powerOn()" 
                                    class="control-btn bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-6 py-3 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center">
                                <i class="bi bi-power mr-2 text-xl"></i> 
                                <span class="font-semibold">Power On</span>
                            </button>
                            <button onclick="HardwareChallenge.runDiagnostics()" 
                                    class="control-btn bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 px-6 py-3 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center">
                                <i class="bi bi-cpu mr-2 text-xl"></i>
                                <span class="font-semibold">Run Diagnostics</span>
                            </button>
                            <button onclick="HardwareChallenge.resetSystem()" 
                                    class="control-btn bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 px-6 py-3 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center">
                                <i class="bi bi-arrow-clockwise mr-2 text-xl"></i>
                                <span class="font-semibold">Reset System</span>
                            </button>
                        </div>
                    </div>

                    <!-- Control Panel Section -->
                    <div class="space-y-6">
                        <!-- Component Shelf -->
                        <div class="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl overflow-hidden">
                            <div class="bg-gradient-to-r from-blue-600 to-blue-700 p-4">
                                <h5 class="font-bold text-lg flex items-center">
                                    <i class="bi bi-box mr-2"></i>
                                    Component Storage
                                </h5>
                            </div>
                            <div id="component-shelf" class="p-4">
                                ${this.renderComponentShelf()}
                            </div>
                        </div>

                        <!-- System Console -->
                        <div class="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl overflow-hidden">
                            <div class="bg-gradient-to-r from-purple-600 to-purple-700 p-4">
                                <h5 class="font-bold text-lg flex items-center">
                                    <i class="bi bi-terminal mr-2"></i>
                                    System Console
                                </h5>
                            </div>
                            <div id="system-console" class="terminal-enhanced h-48 overflow-y-auto p-4 bg-black bg-opacity-60">
                                <div class="text-green-400 font-mono">
                                    <span class="text-blue-400">ASCENDED_DIAGNOSTICS></span> System ready for diagnostics...
                                </div>
                            </div>
                        </div>

                        <!-- Component Status -->
                        <div class="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl overflow-hidden">
                            <div class="bg-gradient-to-r from-green-600 to-green-700 p-4">
                                <h5 class="font-bold text-lg flex items-center">
                                    <i class="bi bi-list-check mr-2"></i>
                                    Component Status
                                </h5>
                            </div>
                            <div id="component-status" class="p-4 space-y-3">
                                ${this.renderComponentStatus()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.setupDragAndDrop();
        this.addVisualEffects();
    }

    static renderMotherboard() {
        const slots = [
            { id: 'cpu-socket', name: 'CPU Socket', x: 120, y: 100, component: 'cpu', size: 'large' },
            { id: 'ram-slot1', name: 'RAM Slot 1', x: 200, y: 50, component: 'ram', size: 'medium' },
            { id: 'ram-slot2', name: 'RAM Slot 2', x: 200, y: 80, component: null, size: 'medium' },
            { id: 'gpu-slot', name: 'PCIe x16', x: 80, y: 200, component: 'gpu', size: 'large' },
            { id: 'storage-sata', name: 'SATA Port', x: 250, y: 150, component: 'storage', size: 'small' },
            { id: 'power-connector', name: '24-pin Power', x: 20, y: 20, component: 'psu', size: 'medium' }
        ];

        return slots.map(slot => {
            const hasComponent = this.computerState.components[slot.component]?.installed;
            const isWorking = this.computerState.components[slot.component]?.working;
            const sizeClass = slot.size === 'large' ? 'w-16 h-12' : slot.size === 'medium' ? 'w-12 h-8' : 'w-8 h-6';
            
            return `
                <div class="component-slot absolute border-2 border-dashed border-gray-400 rounded-lg ${sizeClass} flex items-center justify-center text-xs cursor-pointer hover:border-green-400 hover:shadow-lg hover:shadow-green-400/50 transition-all duration-300 group"
                     style="left: ${slot.x}px; top: ${slot.y}px;"
                     data-slot="${slot.id}" data-component="${slot.component}"
                     title="${slot.name}">
                    <div class="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                        ${slot.name}
                    </div>
                    ${hasComponent ? this.getComponentIcon(slot.component, isWorking, slot.size) : `<i class="bi bi-plus text-gray-500 text-lg"></i>`}
                </div>
            `;
        }).join('');
    }

    static renderComponentShelf() {
        const availableComponents = [
            { id: 'spare-ram', name: 'DDR4 RAM Module', icon: '🧠', type: 'ram', specs: '16GB DDR4-3200' },
            { id: 'spare-ssd', name: 'NVMe SSD Drive', icon: '💾', type: 'storage', specs: '1TB NVMe PCIe 4.0' },
            { id: 'spare-hdd', name: 'SATA HDD Drive', icon: '💿', type: 'storage', specs: '2TB 7200 RPM' }
        ];

        return availableComponents.map(comp => `
            <div class="spare-component bg-gradient-to-r from-gray-700 to-gray-600 border-2 border-gray-500 p-4 rounded-lg mb-3 cursor-move hover:from-gray-600 hover:to-gray-500 hover:border-green-400 hover:shadow-lg hover:shadow-green-400/30 transform hover:scale-105 transition-all duration-300 group"
                 draggable="true" data-component-type="${comp.type}" data-component-id="${comp.id}">
                <div class="flex items-center">
                    <div class="text-3xl mr-3 group-hover:animate-pulse">${comp.icon}</div>
                    <div class="flex-1">
                        <div class="font-semibold text-white">${comp.name}</div>
                        <div class="text-xs text-gray-300">${comp.specs}</div>
                    </div>
                    <div class="text-green-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <i class="bi bi-arrow-right text-xl"></i>
                    </div>
                </div>
            </div>
        `).join('');
    }

    static renderComponentStatus() {
        return Object.entries(this.computerState.components).map(([key, comp]) => {
            const statusColor = comp.installed && comp.working ? 'text-green-400' : 
                               comp.installed && !comp.working ? 'text-red-400' : 'text-gray-500';
            const statusText = comp.installed ? (comp.working ? 'ONLINE' : 'FAILED') : 'NOT INSTALLED';
            const statusIcon = comp.installed && comp.working ? 'check-circle-fill' : 
                              comp.installed && !comp.working ? 'x-circle-fill' : 'circle';
            
            return `
                <div class="flex justify-between items-center bg-gradient-to-r from-gray-700 to-gray-600 px-4 py-3 rounded-lg border-l-4 ${comp.installed && comp.working ? 'border-green-400' : comp.installed && !comp.working ? 'border-red-400' : 'border-gray-500'} hover:shadow-lg transition-all duration-200">
                    <div class="flex items-center">
                        <i class="bi bi-${this.getComponentIconClass(key)} mr-3 text-xl text-blue-400"></i>
                        <span class="font-semibold text-white">${key.toUpperCase()}</span>
                    </div>
                    <div class="flex items-center">
                        <i class="bi bi-${statusIcon} mr-2 ${statusColor}"></i>
                        <span class="${statusColor} font-mono text-sm">${statusText}</span>
                    </div>
                </div>
            `;
        }).join('');
    }

    static getComponentIcon(componentType, isWorking, size = 'medium') {
        const icons = {
            cpu: isWorking ? '🖥️' : '❌',
            ram: isWorking ? '🧠' : '❌',
            gpu: isWorking ? '🎮' : '❌',
            storage: isWorking ? '💾' : '❌',
            psu: isWorking ? '⚡' : '❌'
        };
        const sizeClass = size === 'large' ? 'text-2xl' : size === 'medium' ? 'text-xl' : 'text-lg';
        const glowClass = isWorking ? 'filter drop-shadow-lg' : '';
        
        return `<span class="${sizeClass} ${glowClass} ${isWorking ? 'animate-pulse' : ''}">${icons[componentType] || '❓'}</span>`;
    }

    static getComponentIconClass(componentType) {
        const icons = {
            cpu: 'cpu',
            ram: 'memory',
            gpu: 'gpu-card',
            storage: 'device-ssd',
            psu: 'lightning-charge'
        };
        return icons[componentType] || 'question-circle';
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
        this.updatePowerIndicator(true);
        
        // Add boot sequence animation
        this.animateBootSequence();
        
        // Check if system can boot
        const issues = this.checkSystemIssues();
        
        if (issues.length === 0) {
            this.logMessage('🚀 System booting...', 'info');
            setTimeout(() => {
                this.logMessage('✅ Boot successful! System is running normally.', 'success');
                this.addSuccessEffects();
                this.completePuzzle();
            }, 3000);
        } else {
            this.logMessage('❌ Boot failed! Critical issues detected:', 'error');
            issues.forEach(issue => this.logMessage(`   └─ ${issue}`, 'error'));
            this.addErrorEffects();
        }
    }

    static runDiagnostics() {
        this.logMessage('🔍 Initializing hardware diagnostics...', 'info');
        
        // Add scanning animation
        this.animateDiagnostics();
        
        setTimeout(() => {
            this.logMessage('📊 Hardware scan results:', 'info');
            Object.entries(this.computerState.components).forEach(([key, comp]) => {
                const status = comp.installed ? (comp.working ? 'PASS' : 'FAIL') : 'NOT DETECTED';
                const color = status === 'PASS' ? 'success' : status === 'FAIL' ? 'error' : 'warning';
                const icon = status === 'PASS' ? '✅' : status === 'FAIL' ? '❌' : '⚠️';
                this.logMessage(`   ${icon} ${key.toUpperCase()}: ${status}`, color);
            });

            const issues = this.checkSystemIssues();
            if (issues.length > 0) {
                this.logMessage('🔧 Repair recommendations:', 'warning');
                issues.forEach(issue => this.logMessage(`   └─ ${issue}`, 'warning'));
            } else {
                this.logMessage('🎉 All components functioning optimally!', 'success');
            }
        }, 2000);
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
                const sizeClass = slot.classList.contains('w-16') ? 'large' : 
                                 slot.classList.contains('w-12') ? 'medium' : 'small';
                slot.innerHTML = this.getComponentIcon(componentType, comp.working, sizeClass);
            } else {
                slot.innerHTML = '<i class="bi bi-plus text-gray-500 text-lg"></i>';
            }
        });

        // Update component status with animation
        const statusContainer = document.getElementById('component-status');
        statusContainer.style.opacity = '0.5';
        setTimeout(() => {
            statusContainer.innerHTML = this.renderComponentStatus();
            statusContainer.style.opacity = '1';
        }, 200);
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
        messageDiv.className = `${colors[type] || 'text-gray-400'} font-mono text-sm leading-relaxed animate-fadeIn`;
        messageDiv.innerHTML = `<span class="text-blue-400">ASCENDED_DIAGNOSTICS></span> ${message}`;
        
        console.appendChild(messageDiv);
        console.scrollTop = console.scrollHeight;
    }

    static updatePowerIndicator(isOn) {
        const indicator = document.getElementById('power-indicator');
        const text = indicator.nextElementSibling;
        
        if (isOn) {
            indicator.className = 'w-3 h-3 rounded-full bg-green-400 animate-pulse shadow-lg shadow-green-400/50';
            text.textContent = 'Power: ON';
        } else {
            indicator.className = 'w-3 h-3 rounded-full bg-red-500 animate-pulse';
            text.textContent = 'Power: OFF';
        }
    }

    static addVisualEffects() {
        // Add CSS for enhanced animations
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            @keyframes glow {
                0%, 100% { box-shadow: 0 0 5px rgba(16, 185, 129, 0.3); }
                50% { box-shadow: 0 0 20px rgba(16, 185, 129, 0.6); }
            }
            
            @keyframes scan {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(100%); }
            }
            
            .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
            .animate-glow { animation: glow 2s infinite; }
            .motherboard-bg { position: relative; }
            .terminal-enhanced { background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%); }
            .control-btn { transition: all 0.2s ease; }
            .control-btn:active { transform: scale(0.95); }
        `;
        document.head.appendChild(style);
    }

    static animateBootSequence() {
        const motherboard = document.getElementById('motherboard');
        motherboard.classList.add('animate-glow');
        
        setTimeout(() => {
            motherboard.classList.remove('animate-glow');
        }, 3000);
    }

    static animateDiagnostics() {
        const slots = document.querySelectorAll('.component-slot');
        slots.forEach((slot, index) => {
            setTimeout(() => {
                slot.style.borderColor = '#10b981';
                slot.style.boxShadow = '0 0 10px rgba(16, 185, 129, 0.5)';
                
                setTimeout(() => {
                    slot.style.borderColor = '';
                    slot.style.boxShadow = '';
                }, 500);
            }, index * 300);
        });
    }

    static addSuccessEffects() {
        const motherboard = document.getElementById('motherboard');
        motherboard.style.background = 'linear-gradient(135deg, #064e3b, #047857, #059669)';
        
        setTimeout(() => {
            motherboard.style.background = '';
        }, 2000);
    }

    static addErrorEffects() {
        const motherboard = document.getElementById('motherboard');
        motherboard.style.background = 'linear-gradient(135deg, #7f1d1d, #991b1b, #dc2626)';
        
        setTimeout(() => {
            motherboard.style.background = '';
        }, 2000);
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
