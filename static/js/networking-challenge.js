class NetworkingChallenge {
    static currentSetup = null;
    static connections = [];
    static selectedCable = null;

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
                        Connect the devices to create a functional network. 
                        Drag cables between ports to establish connections.
                    </p>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div class="lg:col-span-2">
                        <div id="network-canvas" class="bg-gray-900 border border-gray-600 rounded p-4 h-96 relative">
                            ${this.renderNetworkDevices()}
                        </div>
                        
                        <div class="flex space-x-2 mt-4">
                            <button onclick="NetworkingChallenge.checkConfiguration()" 
                                    class="bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded">
                                <i class="bi bi-check-circle"></i> Test Network
                            </button>
                            <button onclick="NetworkingChallenge.resetNetwork()" 
                                    class="bg-gray-600 hover:bg-gray-700 px-3 py-2 rounded">
                                <i class="bi bi-arrow-clockwise"></i> Reset
                            </button>
                        </div>
                    </div>

                    <div>
                        <h5 class="font-bold mb-2">Available Cables</h5>
                        <div id="cable-inventory" class="space-y-2 mb-4">
                            <div class="cable-item bg-blue-600 p-2 rounded cursor-pointer" data-cable="ethernet">
                                <i class="bi bi-ethernet"></i> Ethernet Cable
                            </div>
                            <div class="cable-item bg-green-600 p-2 rounded cursor-pointer" data-cable="fiber">
                                <i class="bi bi-wifi"></i> Fiber Cable
                            </div>
                        </div>

                        <h5 class="font-bold mb-2">Network Status</h5>
                        <div id="network-status" class="bg-gray-800 p-3 rounded text-sm">
                            <div class="text-yellow-400">⚠️ Network not configured</div>
                            <div class="text-gray-400 mt-2">Connect all devices to test connectivity.</div>
                        </div>

                        <h5 class="font-bold mb-2 mt-4">Requirements</h5>
                        <ul class="text-sm text-gray-400 space-y-1">
                            <li>• Connect laptops to switch</li>
                            <li>• Connect switch to router</li>
                            <li>• Connect server to switch</li>
                            <li>• Router provides internet access</li>
                        </ul>
                    </div>
                </div>
            </div>
        `;

        this.setupDragAndDrop();
    }

    static renderNetworkDevices() {
        const devices = [
            { id: 'router', name: 'Router', icon: '🔀', x: 300, y: 50, ports: ['wan', 'lan1'] },
            { id: 'switch', name: 'Switch', icon: '🔌', x: 200, y: 150, ports: ['uplink', 'port1', 'port2', 'port3'] },
            { id: 'server', name: 'Server', icon: '🖥️', x: 50, y: 250, ports: ['eth0'] },
            { id: 'laptop1', name: 'Laptop 1', icon: '💻', x: 250, y: 250, ports: ['wifi'] },
            { id: 'laptop2', name: 'Laptop 2', icon: '💻', x: 350, y: 250, ports: ['eth0'] }
        ];

        return devices.map(device => `
            <div class="network-device absolute bg-gray-700 border border-gray-500 rounded p-2 text-center" 
                 style="left: ${device.x}px; top: ${device.y}px; width: 80px;"
                 data-device="${device.id}">
                <div class="text-2xl mb-1">${device.icon}</div>
                <div class="text-xs font-bold">${device.name}</div>
                <div class="ports mt-1">
                    ${device.ports.map((port, index) => `
                        <div class="port w-3 h-3 bg-gray-600 border border-gray-400 rounded-full inline-block m-0.5 cursor-pointer"
                             data-device="${device.id}" data-port="${port}" 
                             style="position: relative;" title="${port}">
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');
    }

    static setupDragAndDrop() {
        let connectionStart = null;

        // Cable selection
        document.querySelectorAll('.cable-item').forEach(cable => {
            cable.addEventListener('click', (e) => {
                document.querySelectorAll('.cable-item').forEach(c => c.classList.remove('ring-2', 'ring-white'));
                cable.classList.add('ring-2', 'ring-white');
                this.selectedCable = cable.dataset.cable;
            });
        });

        // Port connections
        document.querySelectorAll('.port').forEach(port => {
            port.addEventListener('click', (e) => {
                if (!this.selectedCable) {
                    this.showMessage('Select a cable first!', 'warning');
                    return;
                }

                const device = port.dataset.device;
                const portName = port.dataset.port;

                if (!connectionStart) {
                    connectionStart = { device, port: portName, element: port };
                    port.classList.add('bg-yellow-400');
                    this.showMessage(`Selected ${device}:${portName}. Click another port to connect.`, 'info');
                } else {
                    if (connectionStart.device === device && connectionStart.port === portName) {
                        // Clicking same port - cancel
                        connectionStart.element.classList.remove('bg-yellow-400');
                        connectionStart = null;
                        this.showMessage('Connection cancelled.', 'info');
                    } else {
                        // Make connection
                        this.createConnection(connectionStart, { device, port: portName, element: port });
                        connectionStart.element.classList.remove('bg-yellow-400');
                        connectionStart = null;
                    }
                }
            });
        });
    }

    static createConnection(start, end) {
        const connectionId = `${start.device}:${start.port}-${end.device}:${end.port}`;
        
        // Check if connection already exists
        if (this.connections.find(c => c.id === connectionId || c.id === `${end.device}:${end.port}-${start.device}:${start.port}`)) {
            this.showMessage('Connection already exists!', 'warning');
            return;
        }

        this.connections.push({
            id: connectionId,
            from: start,
            to: end,
            cable: this.selectedCable
        });

        start.element.classList.add('bg-green-400');
        end.element.classList.add('bg-green-400');

        this.showMessage(`Connected ${start.device}:${start.port} to ${end.device}:${end.port}`, 'success');
        this.updateNetworkStatus();
    }

    static updateNetworkStatus() {
        const statusElement = document.getElementById('network-status');
        const connectionCount = this.connections.length;
        
        statusElement.innerHTML = `
            <div class="text-blue-400">📡 Active Connections: ${connectionCount}</div>
            <div class="text-gray-400 mt-1 text-xs">
                ${this.connections.map(c => `${c.from.device} ↔ ${c.to.device}`).join('<br>')}
            </div>
        `;
    }

    static checkConfiguration() {
        const requiredConnections = [
            { from: 'switch', to: 'router' },
            { from: 'server', to: 'switch' },
            { from: 'laptop1', to: 'switch' },
            { from: 'laptop2', to: 'switch' }
        ];

        let correctConnections = 0;
        
        requiredConnections.forEach(required => {
            const hasConnection = this.connections.some(conn => 
                (conn.from.device === required.from && conn.to.device === required.to) ||
                (conn.from.device === required.to && conn.to.device === required.from)
            );
            
            if (hasConnection) correctConnections++;
        });

        const statusElement = document.getElementById('network-status');
        
        if (correctConnections === requiredConnections.length) {
            statusElement.innerHTML = `
                <div class="text-green-400">✅ Network configured correctly!</div>
                <div class="text-gray-300 mt-1 text-xs">All devices can communicate.</div>
            `;
            this.completePuzzle();
        } else {
            statusElement.innerHTML = `
                <div class="text-red-400">❌ Configuration incomplete</div>
                <div class="text-gray-300 mt-1 text-xs">
                    ${correctConnections}/${requiredConnections.length} required connections made.
                </div>
            `;
        }
    }

    static resetNetwork() {
        this.connections = [];
        document.querySelectorAll('.port').forEach(port => {
            port.className = 'port w-3 h-3 bg-gray-600 border border-gray-400 rounded-full inline-block m-0.5 cursor-pointer';
        });
        document.getElementById('network-status').innerHTML = `
            <div class="text-yellow-400">⚠️ Network reset</div>
            <div class="text-gray-400 mt-2">Configure the network topology.</div>
        `;
    }

    static showMessage(message, type) {
        const colors = {
            info: 'text-blue-400',
            success: 'text-green-400',
            warning: 'text-yellow-400',
            error: 'text-red-400'
        };

        const statusDiv = document.createElement('div');
        statusDiv.className = `${colors[type]} text-sm mt-1`;
        statusDiv.textContent = message;
        
        const statusContainer = document.getElementById('network-status');
        statusContainer.appendChild(statusDiv);
        
        setTimeout(() => statusDiv.remove(), 3000);
    }

    static completePuzzle() {
        const reward = {
            item: {
                id: 'ethernet-cable',
                name: 'Ethernet Cable',
                icon: '🔌',
                description: 'High-speed network cable',
                quantity: 3
            },
            message: 'Network configured! You earned Ethernet Cables!',
            unlock: null
        };
        
        setTimeout(() => {
            window.game.completeChallenge('networking', reward);
            window.game.closeChallenge();
        }, 2000);
    }
}
