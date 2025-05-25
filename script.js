function toggleSection(sectionId) {
            const section = document.getElementById(sectionId);
            const toggleIcon = section.previousElementSibling.querySelector('.toggle-icon');
            
            section.classList.toggle('active');
            toggleIcon.textContent = section.classList.contains('active') ? '-' : '+';
        }

        // Simulador VNET
        let subnets = [];

        function addSubnet() {
            const name = prompt("Nombre de la subred:");
            if (!name) return;
            
            const cidr = prompt("Rango CIDR (ej: 10.0.1.0/24):");
            if (!cidr) return;
            
            if (!isValidCIDR(cidr)) {
                alert("Formato CIDR inválido. Use formato como 10.0.1.0/24");
                return;
            }
            
            subnets.push({ name, cidr });
            updateSubnetDisplay();
            generateArmTemplate();
        }

        function isValidCIDR(cidr) {
            const cidrRegex = /^([0-9]{1,3}\.){3}[0-9]{1,3}\/([0-9]|[1-2][0-9]|3[0-2])$/;
            return cidrRegex.test(cidr);
        }

        function updateSubnetDisplay() {
            const container = document.getElementById('subnets-container');
            container.innerHTML = '';
            
            subnets.forEach((subnet, index) => {
                const subnetElement = document.createElement('div');
                subnetElement.className = 'subnet-item';
                subnetElement.innerHTML = `
                    <span>${subnet.name} (${subnet.cidr})</span>
                    <button onclick="removeSubnet(${index})">×</button>
                `;
                container.appendChild(subnetElement);
            });
        }

        function removeSubnet(index) {
            subnets.splice(index, 1);
            updateSubnetDisplay();
            generateArmTemplate();
        }

        function generateArmTemplate() {
            const vnetName = document.getElementById('vnet-name').value || 'my-vnet';
            const vnetCidr = document.getElementById('vnet-cidr').value || '10.0.0.0/16';
            
            const template = {
                "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
                "contentVersion": "1.0.0.0",
                "resources": [
                    {
                        "type": "Microsoft.Network/virtualNetworks",
                        "apiVersion": "2020-06-01",
                        "name": vnetName,
                        "location": "[resourceGroup().location]",
                        "properties": {
                            "addressSpace": {
                                "addressPrefixes": [vnetCidr]
                            },
                            "subnets": subnets.map(subnet => ({
                                "name": subnet.name,
                                "properties": {
                                    "addressPrefix": subnet.cidr
                                }
                            }))
                        }
                    }
                ]
            };
            
            document.getElementById('arm-template').textContent = JSON.stringify(template, null, 2);
        }

        function copyTemplate() {
            const templateText = document.getElementById('arm-template').textContent;
            navigator.clipboard.writeText(templateText).then(() => {
                alert("Plantilla copiada al portapapeles");
            });
        }

        // Abrir la primera sección por defecto
        document.addEventListener('DOMContentLoaded', function() {
            toggleSection('nic-content');
            
            // Actualizar plantilla cuando cambian los inputs
            document.querySelectorAll('#vnet-name, #vnet-cidr').forEach(input => {
                input.addEventListener('input', generateArmTemplate);
            });
        });

        function createStars() {
  const starsContainer = document.querySelector('.stars');
  const starCount = 100;
  
  for (let i = 0; i < starCount; i++) {
    const star = document.createElement('div');
    star.classList.add('star');
    
    // Random properties
    const size = Math.random() * 3 + 1;
    const posX = Math.random() * 100;
    const posY = Math.random() * 100;
    const duration = Math.random() * 10 + 5;
    const delay = Math.random() * 5;
    const opacity = Math.random() * 0.5 + 0.3;
    
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.left = `${posX}%`;
    star.style.top = `${posY}%`;
    star.style.setProperty('--duration', `${duration}s`);
    star.style.setProperty('--opacity', opacity);
    star.style.animationDelay = `${delay}s`;
    
    starsContainer.appendChild(star);
  }
}

/* Generate floating particles */

document.addEventListener('DOMContentLoaded', function() {
    toggleSection('nic-content');

    // Actualizar plantilla cuando cambian los inputs
    document.querySelectorAll('#vnet-name, #vnet-cidr').forEach(input => {
        input.addEventListener('input', generateArmTemplate);
    });

    createStars(); // <-- Llama a la función al cargar
});
