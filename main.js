// document.addEventListener("DOMContentLoaded", function () {
//     const canvas = document.getElementById('canvas');
//     const ctx = canvas.getContext('2d');

//     // Define points to create the letter 'F'
//     const points = [
//         { x: 300, y: 100 }, // Start top left
//         { x: 300, y: 200 }, // Down straight
//         { x: 300, y: 300 }, // Down straight
//         { x: 400, y: 300 }, // Right straight (middle bar)
//         { x: 300, y: 300 }, // Back to left
//         { x: 300, y: 500 }, // Down to bottom
//         { x: 300, y: 100 }, // Back to top (not drawn)
//         { x: 450, y: 100 }  // Top right bar
//     ];

//     let slider = { x: points[0].x, y: points[0].y, radius: 10 };
//     let isDragging = false;

//     function drawPath() {
//         ctx.clearRect(0, 0, canvas.width, canvas.height);
//         ctx.beginPath();
//         ctx.moveTo(points[0].x, points[0].y);
//         points.forEach((point, index) => {
//             if (index > 0) {
//                 ctx.lineTo(point.x, point.y);
//             }
//         });
//         ctx.strokeStyle = 'blue';
//         ctx.stroke();
//     }

//     function drawSlider() {
//         ctx.beginPath();
//         ctx.arc(slider.x, slider.y, slider.radius, 0, Math.PI * 2);
//         ctx.fillStyle = 'grey';
//         ctx.fill();
//     }

//     function updateSlider(mouseX, mouseY) {
//         if (!isDragging) return;

//         let minDist = Infinity;
//         points.forEach((point, index) => {
//             if (index > 0) {
//                 let tClosest = findClosestPointOnLine(points[index - 1], point, mouseX, mouseY);
//                 let x = points[index - 1].x + tClosest * (point.x - points[index - 1].x);
//                 let y = points[index - 1].y + tClosest * (point.y - points[index - 1].y);
//                 let dist = Math.sqrt((x - mouseX) ** 2 + (y - mouseY) ** 2);
//                 if (dist < minDist) {
//                     minDist = dist;
//                     slider.x = x;
//                     slider.y = y;
//                 }
//             }
//         });
//         drawPath();
//         drawSlider();
//     }

//     function findClosestPointOnLine(p1, p2, px, py) {
//         let t = ((px - p1.x) * (p2.x - p1.x) + (py - p1.y) * (p2.y - p1.y)) / (Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
//         return Math.max(0, Math.min(1, t));
//     }

//     canvas.addEventListener('mousedown', function (event) {
//         const rect = canvas.getBoundingClientRect();
//         const mouseX = event.clientX - rect.left;
//         const mouseY = event.clientY - rect.top;
//         if (Math.sqrt((mouseX - slider.x) ** 2 + (mouseY - slider.y) ** 2) <= slider.radius) {
//             isDragging = true;
//         }
//     });

//     canvas.addEventListener('mousemove', function (event) {
//         if (isDragging) {
//             const rect = canvas.getBoundingClientRect();
//             const mouseX = event.clientX - rect.left;
//             const mouseY = event.clientY - rect.top;
//             updateSlider(mouseX, mouseY);
//         }
//     });

//     canvas.addEventListener('mouseup', function () {
//         isDragging = false;
//     });

//     canvas.addEventListener('mouseout', function () {
//         isDragging = false;
//     });

//     drawPath();
//     drawSlider();
// });





const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const sliderCanvas = document.getElementById('sliderCanvas');
const sctx = sliderCanvas.getContext('2d');



// draw letter
function drawLetter(letterPoints) {
    const firstPoint = letterPoints[0];
    ctx.lineWidth = 10;
    ctx.strokeStyle = '#eee';
    ctx.beginPath();
    ctx.moveTo(firstPoint.sx, firstPoint.sy);
    for (let i = 1; i < letterPoints.length; i++) {
        ctx.bezierCurveTo(letterPoints[i].cx1, letterPoints[i].cy1, letterPoints[i].cx2, letterPoints[i].cy2, letterPoints[i].ex, letterPoints[i].ey);
    }
    ctx.stroke();
}

function drawSlider(x, y, color, radius) {
    sctx.beginPath();
    sctx.arc(x, y, radius, 0, 2 * Math.PI, false);
    sctx.fillStyle = color;
    sctx.fill()
    currentSliderPosition.x = x;
    currentSliderPosition.y = y;
}

function bezier(t, P0, P1, P2, P3) {
    const x = (1-t)**3*P0.x + 3*(1-t)**2*t*P1.x + 3*(1-t)*t**2*P2.x + t**3*P3.x;
    const y = (1-t)**3*P0.y + 3*(1-t)**2*t*P1.y + 3*(1-t)*t**2*P2.y + t**3*P3.y;
    return {x, y};
}

function findClosestPointOnBezier(mouseX, mouseY, P0, P1, P2, P3) {
    let minDist = Infinity;
    let closestPoint = null;
    let closestT = 0;
    for (let i = 0; i <= 1000; i++) {
        let t = i / 1000;
        let pt = bezier(t, P0, P1, P2, P3);
        let dist = Math.sqrt((pt.x - mouseX)**2 + (pt.y - mouseY)**2);
        if (dist < minDist) {
            minDist = dist;
            closestPoint = pt;
            closestT = t;
        }
    }
    return { closestPoint, closestT, minDist };
}











function drawClosestPoint(ctx, point) {
    ctx.beginPath();
    ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI);
    ctx.fillStyle = 'red';
    ctx.fill();
}
let point = {};
let currentSliderPosition = {};
let drawing = false;
let oldClosestT = -1;
BaLetterPoints = [
    {sx: 415, sy:182},
    {sx:415, sy:182, cx1: 451, cy1:225, cx2: 428, cy2:261, ex:385, ey:276},
    {sx:385, sy:276, cx1: 271, cy1:317, cx2: 117, cy2:297, ex:199, ey:181}
];
let currentLine = BaLetterPoints[1];
sliderCanvas.addEventListener('mousemove', (event) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    point = findClosestPointOnBezier(mouseX, mouseY, {x:currentLine.sx, y:currentLine.sy}, {x:currentLine.cx1, y:currentLine.cy1}, {x:currentLine.cx2, y:currentLine.cy2}, {x:currentLine.ex, y:currentLine.ey});
    const distance = calculateDistance(currentSliderPosition.x, currentSliderPosition.y, mouseX, mouseY);
    if (drawing && distance <=20 && point.closestT > oldClosestT) {
        if (point.minDist <= 20) {
            oldClosestT = point.closestT;
            // drawClosestPoint(ctx, point.closestPoint);
            drawPartialBezier(ctx, {x:currentLine.sx, y:currentLine.sy}, {x:currentLine.cx1, y:currentLine.cy1}, {x:currentLine.cx2, y:currentLine.cy2}, {x:currentLine.ex, y:currentLine.ey}, oldClosestT, 'red');
            clearSliderCavnas();
            drawSlider(point.closestPoint.x, point.closestPoint.y, "lightblue", 20);
            drawSlider(point.closestPoint.x, point.closestPoint.y, "white", 10);
            if (oldClosestT === 1) {
                currentLine = BaLetterPoints[2];
                oldClosestT = -1;
            }
        } else {
            drawing = false;
        }
    }
});

function drawPartialBezier(ctx, P0, P1, P2, P3, t, color) {
    // Compute the points along the line at t using De Casteljau's algorithm
    function interpolate(p1, p2, t) {
        return {
            x: p1.x + (p2.x - p1.x) * t,
            y: p1.y + (p2.y - p1.y) * t
        };
    }

    // First generation of intermediate points
    let P01 = interpolate(P0, P1, t);
    let P12 = interpolate(P1, P2, t);
    let P23 = interpolate(P2, P3, t);

    // Second generation of intermediate points
    let P012 = interpolate(P01, P12, t);
    let P123 = interpolate(P12, P23, t);

    // Final point on the curve at t
    let P0123 = interpolate(P012, P123, t);

    // Draw the curve using the control points from P0 to P0123
    ctx.beginPath();
    ctx.moveTo(P0.x, P0.y);
    ctx.bezierCurveTo(P01.x, P01.y, P012.x, P012.y, P0123.x, P0123.y);
    ctx.strokeStyle = color;
    ctx.stroke();
}






function calculateDistance(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
}
function clearSliderCavnas() {
    sctx.clearRect(0, 0, sliderCanvas.width, sliderCanvas.height);
}
sliderCanvas.addEventListener('mousedown', function(event) {
    if (event.button === 0) {
        drawing = true;
    }
});
sliderCanvas.addEventListener('mouseup', function(event) {
    if (event.button === 0) {
        drawing = false;
    }
});
sliderCanvas.addEventListener('mouseout', function(event) {
    drawing = false;
});


drawLetter(BaLetterPoints);
drawSlider(415, 182, "lightblue", 20);
drawSlider(415, 182, "white", 10);
// drawing points
ctx.fillRect(415, 182, 10, 10);
ctx.fillRect(385, 276, 10, 10);
ctx.fillRect(199, 181, 10, 10);