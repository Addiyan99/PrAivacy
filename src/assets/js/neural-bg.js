// Neural Network Background - WITH FADE TO MIDDLE
const canvas = document.getElementById('neuralCanvas');
if (canvas) {
    const ctx = canvas.getContext('2d');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    let mouseX = width / 2;
    let mouseY = height / 2;
    let scrollY = 0;

    // Responsive side width - smaller on mobile
    const getSideWidth = () => {
        if (width < 768) {
            return Math.min(150, width * 0.15); // On mobile, max 10% of screen or 150px
        }
        return 250;
    };

    let sideWidth = getSideWidth();

    class Node {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.baseX = x;
            this.baseY = y;
            this.vx = (Math.random() - 0.5) * 0.3;
            this.vy = (Math.random() - 0.5) * 0.3;
            this.radius = Math.random() * 2.5 + 1.5;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            const dx = this.baseX - this.x;
            const dy = this.baseY - this.y;
            this.x += dx * 0.01;
            this.y += dy * 0.01;

            const mouseDistance = Math.hypot(mouseX - this.x, mouseY - this.y);
            if (mouseDistance < 200) {
                const angle = Math.atan2(this.y - mouseY, this.x - mouseX);
                const force = (200 - mouseDistance) / 200;
                this.x += Math.cos(angle) * force * 3;
                this.y += Math.sin(angle) * force * 3;
            }

            this.y += scrollY * 0.0003;
        }

        draw() {
            // Calculate distance from edge (0 = at edge, 1 = at middle boundary)
            let distanceFromEdge;
            if (this.x < width / 2) {
                // Left side - distance from left edge
                distanceFromEdge = this.x / sideWidth;
            } else {
                // Right side - distance from right edge
                distanceFromEdge = (width - this.x) / sideWidth;
            }

            // Clamp between 0 and 1
            distanceFromEdge = Math.max(0, Math.min(1, distanceFromEdge));

            // Fade out as it gets closer to middle
            const fadeOpacity = 1 - distanceFromEdge;

            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(135, 206, 250, ${0.6 * fadeOpacity})`;
            ctx.shadowBlur = 10 * fadeOpacity;
            ctx.shadowColor = `rgba(135, 206, 250, ${0.7 * fadeOpacity})`;
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }

    // Create nodes with COMPLETELY RANDOM positions
    const nodes = [];
    const getNodeCount = () => {
        if (width < 768) {
            return 20; // Fewer nodes on mobile for better performance
        }
        return 60;
    };
    const nodeCount = getNodeCount();

    // Left side nodes
    for (let i = 0; i < nodeCount; i++) {
        const x = Math.random() * sideWidth;
        const y = Math.random() * height;
        nodes.push(new Node(x, y));
    }

    // Right side nodes
    for (let i = 0; i < nodeCount; i++) {
        const x = width - sideWidth + Math.random() * sideWidth;
        const y = Math.random() * height;
        nodes.push(new Node(x, y));
    }

    function drawConnections() {
        const maxDistance = 150;

        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const distance = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);

                if (distance < maxDistance) {
                    // Calculate fade for both nodes
                    let fadeI, fadeJ;

                    // Node i fade
                    if (nodes[i].x < width / 2) {
                        fadeI = 1 - (nodes[i].x / sideWidth);
                    } else {
                        fadeI = 1 - ((width - nodes[i].x) / sideWidth);
                    }

                    // Node j fade
                    if (nodes[j].x < width / 2) {
                        fadeJ = 1 - (nodes[j].x / sideWidth);
                    } else {
                        fadeJ = 1 - ((width - nodes[j].x) / sideWidth);
                    }

                    // Use average fade for the connection
                    const averageFade = (fadeI + fadeJ) / 2;
                    const opacity = (1 - (distance / maxDistance)) * averageFade;

                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(135, 206, 250, ${opacity * 0.4})`;
                    ctx.lineWidth = 1.5;
                    ctx.moveTo(nodes[i].x, nodes[i].y);
                    ctx.lineTo(nodes[j].x, nodes[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        drawConnections();

        nodes.forEach(node => {
            node.update();
            node.draw();
        });

        requestAnimationFrame(animate);
    }

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    window.addEventListener('scroll', () => {
        scrollY = window.scrollY;
    });

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;

        // Update side width for new screen size
        sideWidth = getSideWidth();
        const nodeCount = getNodeCount();

        nodes.length = 0;

        // Left side
        for (let i = 0; i < nodeCount; i++) {
            const x = Math.random() * sideWidth;
            const y = Math.random() * height;
            nodes.push(new Node(x, y));
        }

        // Right side
        for (let i = 0; i < nodeCount; i++) {
            const x = width - sideWidth + Math.random() * sideWidth;
            const y = Math.random() * height;
            nodes.push(new Node(x, y));
        }
    });

    animate();
}