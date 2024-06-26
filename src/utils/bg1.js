// 获取 Canvas 元素和上下文
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// 设置 Canvas 的宽度和高度
w = canvas.width = window.innerWidth;
h = canvas.height = window.innerHeight;

// 星星数组
let stars = [];

function drawBgImage(ctx) {
const img = new Image();
img.src = '/src/assets/bg.png';
img.onload = () => {
    console.log('img loaded');
    ctx.drawImage(img, 0, 0, w, h);
}
}
// 创建星星
function createStars() {
    drawBgImage(ctx);
    console.log('createStars');
    for (let i = 0; i < 200; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 1.5 + 0.5, // 星星的半径
            color: 'rgba(0, 255, 255, ' + Math.random() + ')', // 星星的颜色
            speed: Math.random() * 0.2 + 0.1, // 星星的速度
            angle: Math.random() * Math.PI * 2 // 星星的初始角度
        });
    }
}

// 绘制星星
function drawStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < stars.length; i++) {
        let star = stars[i];

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.fill();
    }
}

// 更新星星的位置和角度
function updateStars() {
    for (let i = 0; i < stars.length; i++) {
        let star = stars[i];

        // 更新星星的位置
        star.x += Math.cos(star.angle) * star.speed;
        star.y += Math.sin(star.angle) * star.speed;

        // 让星星绕 Canvas 中心点旋转
        star.angle += 0.01;

        // 如果星星超出 Canvas 边界，则重新放置到顶部
        if (star.x < 0 || star.x > canvas.width || star.y < 0 || star.y > canvas.height) {
            star.x = Math.random() * canvas.width;
            star.y = Math.random() * canvas.height;
        }
    }
}

// 初始化并运行动画
function animate() {
    drawStars();
    updateStars();

    requestAnimationFrame(animate);
}

// 初始化星星
createStars();

// 启动动画
animate();
