class NetworkingChallenge {
    static currentSetup = null;
    static connections = [];
    static selectedCable = null;
    static draggedConnection = null;
    static animationCanvas = null;

    static load(titleElement, contentElement) {
        titleElement.textContent = "Network Configuration Lab";
        Hints.setChallenge('networking');
        this.render(contentElement);
    }

    static render(container) {
        container.innerHTML = `
            <div class="puzzle-container">
                <div class="mb-4">
                    <h4 class="text-lg font-bold mb-2">Build the Network Topology</h4>
                    <p class="text-gray-300 mb-4">
                        Select a cable type, then click and drag between device ports to create connections.
                    </p>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-4 gap-4">
                    <div class="lg:col-span-3">
                        <div id="network-canvas" class="bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-gray-600 rounded-lg p-6 h-96 relative overflow-hidden shadow-2xl">
                            <!-- Animated background grid -->
                            <div class="absolute inset-0 opacity-10">
                                <div class="grid-bg"></div>
                            </div>
                            
                            <!-- Connection canvas for drawing cables -->
                            <svg id="cable-canvas" class="absolute inset-0 w-full h-full pointer-events-none" style="z-index: 1;">
                                <defs>
                                    <filter id="glow">
                                        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                                        <feMerge> 
                                            <feMergeNode in="coloredBlur"/>
                                            <feMergeNode in="SourceGraphic"/>
                                        </feMerge>
                                    </filter>
                                    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                                        <polygon points="0 0, 10 3.5, 0 7" fill="#4ade80" />
                                    </marker>
                                </defs>
                            </svg>
                            
                            <!-- Network devices -->
                            <div id="devices-container" style="z-index: 2;" class="relative">
                                ${this.renderNetworkDevices()}
                            </div>
                        </div>
                        
                        <div class="flex justify-center space-x-3 mt-4">
                            <button onclick="NetworkingChallenge.checkConfiguration()" 
                                    class="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-6 py-3 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200">
                                <i class="bi bi-wifi mr-2"></i> Test Network
                            </button>
                            <button onclick="NetworkingChallenge.resetNetwork()" 
                                    class="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 px-6 py-3 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200">
                                <i class="bi bi-arrow-clockwise mr-2"></i> Reset
                            </button>
                        </div>
                    </div>

                    <div class="space-y-4">
                        <div>
                            <h5 class="font-bold mb-3 text-cyan-400">
                                <i class="bi bi-ethernet mr-2"></i>Cable Types
                            </h5>
                            <div id="cable-inventory" class="space-y-3">
                                <div class="cable-item bg-gradient-to-r from-blue-600 to-blue-700 p-3 rounded-lg cursor-pointer border-2 border-transparent hover:border-blue-400 transition-all duration-200 shadow-md hover:shadow-lg" 
                                     data-cable="ethernet" data-color="#3b82f6">
                                    <div class="flex items-center">
                                        <div class="w-4 h-4 bg-blue-400 rounded-full mr-3 shadow-inner"></div>
                                        <div>
                                            <div class="font-semibold">Ethernet Cable</div>
                                            <div class="text-xs opacity-80">Cat6 - 1Gbps</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="cable-item bg-gradient-to-r from-green-600 to-green-700 p-3 rounded-lg cursor-pointer border-2 border-transparent hover:border-green-400 transition-all duration-200 shadow-md hover:shadow-lg" 
                                     data-cable="fiber" data-color="#10b981">
                                    <div class="flex items-center">
                                        <div class="w-4 h-4 bg-green-400 rounded-full mr-3 shadow-inner"></div>
                                        <div>
                                            <div class="font-semibold">Fiber Optic</div>
                                            <div class="text-xs opacity-80">10Gbps</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h5 class="font-bold mb-3 text-cyan-400">
                                <i class="bi bi-router mr-2"></i>Network Status
                            </h5>
                            <div id="network-status" class="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-600 p-4 rounded-lg text-sm shadow-inner">
                                <div class="flex items-center text-yellow-400 mb-2">
                                    <i class="bi bi-exclamation-triangle mr-2"></i>
                                    <span>Network not configured</span>
                                </div>
                                <div class="text-gray-400 text-xs">Connect all devices to test connectivity.</div>
                            </div>
                        </div>

                        <div>
                            <h5 class="font-bold mb-3 text-cyan-400">
                                <i class="bi bi-list-check mr-2"></i>Requirements
                            </h5>
                            <div class="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-600 p-4 rounded-lg shadow-inner">
                                <ul class="text-sm text-gray-300 space-y-2">
                                    <li class="flex items-center" id="req-laptops">
                                        <i class="bi bi-circle text-gray-500 mr-2"></i>
                                        <span>Connect laptops to switch</span>
                                    </li>
                                    <li class="flex items-center" id="req-switch">
                                        <i class="bi bi-circle text-gray-500 mr-2"></i>
                                        <span>Connect switch to router</span>
                                    </li>
                                    <li class="flex items-center" id="req-server">
                                        <i class="bi bi-circle text-gray-500 mr-2"></i>
                                        <span>Connect server to switch</span>
                                    </li>
                                    <li class="flex items-center" id="req-internet">
                                        <i class="bi bi-circle text-gray-500 mr-2"></i>
                                        <span>Router provides internet</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.setupInteractions();
        this.animateBackground();
    }

    static renderNetworkDevices() {
        const devices = [
            { id: 'router', name: 'Router', icon: '🌐', x: 320, y: 60, ports: [
                { id: 'wan', name: 'WAN', x: 15, y: -10, type: 'wan' },
                { id: 'lan1', name: 'LAN1', x: 15, y: 45, type: 'lan' }
            ]},
            { id: 'switch', name: 'Switch', icon: '⚡', x: 220, y: 160, ports: [
                { id: 'uplink', name: 'Uplink', x: 15, y: -10, type: 'uplink' },
                { id: 'port1', name: 'Port1', x: -10, y: 30, type: 'port' },
                { id: 'port2', name: 'Port2', x: 25, y: 30, type: 'port' },
                { id: 'port3', name: 'Port3', x: 60, y: 30, type: 'port' }
            ]},
            { id: 'server', name: 'Server', icon: '🖥️', x: 60, y: 260, ports: [
                { id: 'eth0', name: 'ETH0', x: 30, y: -10, type: 'ethernet' }
            ]},
            { id: 'laptop1', name: 'Laptop 1', icon: '💻', x: 280, y: 260, ports: [
                { id: 'wifi', name: 'WiFi', x: 20, y: -10, type: 'wifi' }
            ]},
            { id: 'laptop2', name: 'Laptop 2', icon: '💻', x: 400, y: 260, ports: [
                { id: 'eth0', name: 'ETH0', x: 20, y: -10, type: 'ethernet' }
            ]}
        ];

        return devices.map(device => `
            <div class="network-device absolute bg-gradient-to-br from-gray-700 to-gray-800 border-2 border-gray-500 rounded-xl p-3 text-center shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105" 
                 style="left: ${device.x}px; top: ${device.y}px; width: 90px;"
                 data-device="${device.id}">
                <div class="device-icon text-3xl mb-1 filter drop-shadow-lg">${device.icon}</div>
                <div class="text-xs font-bold text-cyan-300">${device.name}</div>
                <div class="ports relative">
                    ${device.ports.map(port => `
                        <div class="port-container absolute" style="left: ${port.x}px; top: ${port.y}px;">
                            <div class="network-port w-6 h-6 bg-gradient-to-br from-gray-600 to-gray-700 border-2 border-gray-400 rounded-lg cursor-pointer hover:border-cyan-400 hover:shadow-lg transform hover:scale-110 transition-all duration-200 flex items-center justify-center"
                                 data-device="${device.id}" data-port="${port.id}" 
                                 title="${device.name} - ${port.name}">
                                <div class="port-indicator w-2 h-2 bg-gray-500 rounded-full"></div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');
    }

    static setupInteractions() {
        let dragStart = null;
        let isConnecting = false;
        let tempLine = null;

        // Cable selection
        document.querySelectorAll('.cable-item').forEach(cable => {
            cable.addEventListener('click', (e) => {
                document.querySelectorAll('.cable-item').forEach(c => {
                    c.classList.remove('ring-4', 'ring-cyan-400', 'ring-opacity-50');
                    c.classList.add('border-transparent');
                });
                
                cable.classList.remove('border-transparent');
                cable.classList.add('ring-4', 'ring-cyan-400', 'ring-opacity-50');
                
                this.selectedCable = {
                    type: cable.dataset.cable,
                    color: cable.dataset.color
                };
                
                this.showMessage(`Selected ${cable.dataset.cable} cable`, 'info');
            });
        });

        // Port interactions
        document.querySelectorAll('.network-port').forEach(port => {
            port.addEventListener('mousedown', (e) => {
                if (!this.selectedCable) {
                    this.showMessage('Select a cable type first!', 'warning');
                    return;
                }

                e.preventDefault();
                isConnecting = true;
                dragStart = {
                    device: port.dataset.device,
                    port: port.dataset.port,
                    element: port,
                    rect: port.getBoundingClientRect(),
                    canvasRect: document.getElementById('cable-canvas').getBoundingClientRect()
                };

                port.classList.add('ring-4', 'ring-yellow-400', 'ring-opacity-75');
                port.querySelector('.port-indicator').classList.add('bg-yellow-400');
                
                this.showMessage(`Click another port to connect from ${dragStart.device}:${dragStart.port}`, 'info');
            });

            port.addEventListener('mouseenter', (e) => {
                if (isConnecting && dragStart) {
                    port.classList.add('ring-2', 'ring-green-400', 'ring-opacity-50');
                }
            });

            port.addEventListener('mouseleave', (e) => {
                if (isConnecting) {
                    port.classList.remove('ring-2', 'ring-green-400', 'ring-opacity-50');
                }
            });

            port.addEventListener('mouseup', (e) => {
                if (isConnecting && dragStart) {
                    const endDevice = port.dataset.device;
                    const endPort = port.dataset.port;

                    if (dragStart.device === endDevice && dragStart.port === endPort) {
                        // Same port - cancel
                        this.cancelConnection(dragStart);
                        isConnecting = false;
                        dragStart = null;
                        return;
                    }

                    this.createConnection(dragStart, {
                        device: endDevice,
                        port: endPort,
                        element: port
                    });

                    this.resetPortStates();
                    isConnecting = false;
                    dragStart = null;
                }
            });
        });

        // Global mouse events for connection dragging
        document.addEventListener('mousemove', (e) => {
            if (isConnecting && dragStart && tempLine) {
                const canvas = document.getElementById('cable-canvas');
                const rect = canvas.getBoundingClientRect();
                const endX = e.clientX - rect.left;
                const endY = e.clientY - rect.top;
                
                this.updateTempLine(tempLine, endX, endY);
            }
        });

        document.addEventListener('mouseup', (e) => {
            if (isConnecting && dragStart) {
                this.cancelConnection(dragStart);
                isConnecting = false;
                dragStart = null;
            }
        });
    }

    static createConnection(start, end) {
        const connectionId = `${start.device}:${start.port}-${end.device}:${end.port}`;
        
        // Check if connection already exists
        if (this.connections.find(c => c.id === connectionId || c.id === `${end.device}:${end.port}-${start.device}:${start.port}`)) {
            this.showMessage('Connection already exists!', 'warning');
            return;
        }

        const connection = {
            id: connectionId,
            from: start,
            to: end,
            cable: this.selectedCable.type,
            color: this.selectedCable.color
        };

        this.connections.push(connection);
        this.drawConnection(connection);
        this.updatePortStates(start.element, end.element);
        this.showMessage(`Connected ${start.device}:${start.port} ↔ ${end.device}:${end.port}`, 'success');
        this.updateNetworkStatus();
    }

    static drawConnection(connection) {
        const canvas = document.getElementById('cable-canvas');
        const canvasRect = canvas.getBoundingClientRect();
        
        const startRect = connection.from.element.getBoundingClientRect();
        const endRect = connection.to.element.getBoundingClientRect();
        
        const startX = startRect.left - canvasRect.left + startRect.width / 2;
        const startY = startRect.top - canvasRect.top + startRect.height / 2;
        const endX = endRect.left - canvasRect.left + endRect.width / 2;
        const endY = endRect.top - canvasRect.top + endRect.height / 2;

        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', startX);
        line.setAttribute('y1', startY);
        line.setAttribute('x2', endX);
        line.setAttribute('y2', endY);
        line.setAttribute('stroke', connection.color);
        line.setAttribute('stroke-width', '4');
        line.setAttribute('stroke-linecap', 'round');
        line.setAttribute('filter', 'url(#glow)');
        line.setAttribute('data-connection', connection.id);
        line.classList.add('connection-line');

        // Add animated dash effect for fiber optic
        if (connection.cable === 'fiber') {
            line.setAttribute('stroke-dasharray', '8 4');
            line.classList.add('animate-pulse');
        }

        canvas.appendChild(line);

        // Animate the line drawing
        const length = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
        line.style.strokeDasharray = length;
        line.style.strokeDashoffset = length;
        line.style.animation = 'drawLine 0.8s ease-out forwards';
    }

    static updatePortStates(startPort, endPort) {
        [startPort, endPort].forEach(port => {
            port.classList.remove('ring-4', 'ring-yellow-400', 'ring-opacity-75');
            port.classList.add('ring-2', 'ring-green-400', 'ring-opacity-75');
            port.querySelector('.port-indicator').classList.remove('bg-gray-500', 'bg-yellow-400');
            port.querySelector('.port-indicator').classList.add('bg-green-400');
        });
    }

    static resetPortStates() {
        document.querySelectorAll('.network-port').forEach(port => {
            port.classList.remove('ring-4', 'ring-yellow-400', 'ring-opacity-75', 'ring-2', 'ring-green-400', 'ring-opacity-50');
        });
    }

    static cancelConnection(dragStart) {
        this.resetPortStates();
        dragStart.element.querySelector('.port-indicator').classList.remove('bg-yellow-400');
        dragStart.element.querySelector('.port-indicator').classList.add('bg-gray-500');
        this.showMessage('Connection cancelled', 'info');
    }

    static updateNetworkStatus() {
        const statusElement = document.getElementById('network-status');
        const connectionCount = this.connections.length;
        
        statusElement.innerHTML = `
            <div class="flex items-center text-blue-400 mb-2">
                <i class="bi bi-wifi mr-2"></i>
                <span>Active Connections: ${connectionCount}</span>
            </div>
            <div class="text-gray-300 text-xs space-y-1">
                ${this.connections.map(c => `
                    <div class="flex items-center">
                        <div class="w-2 h-2 rounded-full mr-2" style="background-color: ${c.color}"></div>
                        <span>${c.from.device} ↔ ${c.to.device}</span>
                    </div>
                `).join('')}
            </div>
        `;
    }

    static checkConfiguration() {
        const requirements = [
            { id: 'req-laptops', check: () => this.checkConnection('laptop1', 'switch') && this.checkConnection('laptop2', 'switch') },
            { id: 'req-switch', check: () => this.checkConnection('switch', 'router') },
            { id: 'req-server', check: () => this.checkConnection('server', 'switch') },
            { id: 'req-internet', check: () => this.checkConnection('switch', 'router') }
        ];

        let allComplete = true;

        requirements.forEach(req => {
            const element = document.getElementById(req.id);
            const icon = element.querySelector('i');
            
            if (req.check()) {
                icon.className = 'bi bi-check-circle-fill text-green-400 mr-2';
                element.classList.add('text-green-400');
            } else {
                icon.className = 'bi bi-x-circle-fill text-red-400 mr-2';
                element.classList.add('text-red-400');
                allComplete = false;
            }
        });

        const statusElement = document.getElementById('network-status');
        
        if (allComplete) {
            statusElement.innerHTML = `
                <div class="flex items-center text-green-400 mb-2">
                    <i class="bi bi-check-circle-fill mr-2"></i>
                    <span>Network Online!</span>
                </div>
                <div class="text-gray-300 text-xs">All devices connected and communicating.</div>
            `;
            this.completePuzzle();
        } else {
            statusElement.innerHTML = `
                <div class="flex items-center text-red-400 mb-2">
                    <i class="bi bi-x-circle-fill mr-2"></i>
                    <span>Configuration Incomplete</span>
                </div>
                <div class="text-gray-300 text-xs">Check requirements above.</div>
            `;
        }
    }

    static checkConnection(device1, device2) {
        return this.connections.some(conn => 
            (conn.from.device === device1 && conn.to.device === device2) ||
            (conn.from.device === device2 && conn.to.device === device1)
        );
    }

    static resetNetwork() {
        this.connections = [];
        this.selectedCable = null;
        
        // Clear all visual connections
        document.querySelectorAll('.connection-line').forEach(line => line.remove());
        
        // Reset all ports
        document.querySelectorAll('.network-port').forEach(port => {
            port.className = 'network-port w-6 h-6 bg-gradient-to-br from-gray-600 to-gray-700 border-2 border-gray-400 rounded-lg cursor-pointer hover:border-cyan-400 hover:shadow-lg transform hover:scale-110 transition-all duration-200 flex items-center justify-center';
            port.querySelector('.port-indicator').className = 'port-indicator w-2 h-2 bg-gray-500 rounded-full';
        });
        
        // Reset cable selection
        document.querySelectorAll('.cable-item').forEach(cable => {
            cable.classList.remove('ring-4', 'ring-cyan-400', 'ring-opacity-50');
            cable.classList.add('border-transparent');
        });
        
        // Reset requirements
        document.querySelectorAll('[id^="req-"]').forEach(req => {
            req.querySelector('i').className = 'bi bi-circle text-gray-500 mr-2';
            req.classList.remove('text-green-400', 'text-red-400');
        });
        
        document.getElementById('network-status').innerHTML = `
            <div class="flex items-center text-yellow-400 mb-2">
                <i class="bi bi-exclamation-triangle mr-2"></i>
                <span>Network Reset</span>
            </div>
            <div class="text-gray-400 text-xs">Configure the network topology.</div>
        `;
    }

    static showMessage(message, type) {
        // Create floating notification
        const notification = document.createElement('div');
        notification.className = `fixed top-20 right-4 p-3 rounded-lg shadow-lg transform translate-x-full transition-transform duration-300 z-50`;
        
        const colors = {
            info: 'bg-blue-600 text-white',
            success: 'bg-green-600 text-white',
            warning: 'bg-yellow-600 text-black',
            error: 'bg-red-600 text-white'
        };
        
        notification.classList.add(...colors[type].split(' '));
        notification.innerHTML = `
            <div class="flex items-center">
                <i class="bi bi-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : type === 'error' ? 'x-circle' : 'info-circle'} mr-2"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => notification.classList.remove('translate-x-full'), 100);
        
        // Animate out and remove
        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    static animateBackground() {
        const canvas = document.querySelector('#network-canvas');
        canvas.style.background = `
            radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(16, 185, 129, 0.1) 0%, transparent 50%),
            linear-gradient(135deg, #1f2937 0%, #111827 100%)
        `;
    }

    static completePuzzle() {
        // Add celebration effect
        this.showMessage('🎉 Network Configuration Complete!', 'success');
        
        const reward = {
            item: {
                id: 'network-analyzer',
                name: 'Network Analyzer',
                icon: '📡',
                description: 'Advanced network diagnostic tool',
                quantity: 1
            },
            message: 'Network configured successfully! You earned a Network Analyzer!',
            unlock: null
        };
        
        setTimeout(() => {
            window.game.completeChallenge('networking', reward);
        }, 2000);
    }
}
