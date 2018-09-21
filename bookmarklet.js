(function() {
	if (window.canvFunc != undefined) {
		canvFunc.openMenu();
	} else {
		var h2c = document.createElement('script');
		h2c.onload = function() {
			document.documentElement.scrollTop = 0;
			html2canvas(document.body, {
				letterRendering: 1,
				allowTaint: true
			}).then(function(canvas) {
				var theBody = document.body;
				while (theBody.firstChild) {
					theBody.removeChild(theBody.firstChild);
				}
				window.canvas = canvas;
				document.body.appendChild(canvas);
				window.back = document.createElement('canvas');
				back.width = canvas.width;
				back.height = canvas.height;
				var backCTX = back.getContext('2d');
				backCTX.drawImage(canvas, 0, 0);
				loadCanvas();
			});
		};
		h2c.src = "https://html2canvas.hertzen.com/dist/html2canvas.min.js";
		document.body.appendChild(h2c);
		window.loadCanvas = function() {
			window.ctx = canvas.getContext('2d');
			window.strokeStyle = "red";
			window.lineWidth = 10;
			window.globalAlpha = 1;
			window.isDrawing = false;
			window.isDrawingTouch = {};
			window.canvFunc = {};
			canvFunc.lines = {};
			canvFunc.drawFunc = function(x, y, id) {
				if (!canvFunc.lines[id] || (id == "mouse" && !isDrawing) || (id != "mouse" && !isDrawingTouch[id])) {
					return;
				}
				ctx.lineWidth = lineWidth;
				ctx.strokeStyle = strokeStyle;
				ctx.lineCap = "round";
				ctx.globalAlpha = globalAlpha;
				ctx.beginPath();
				ctx.moveTo(canvFunc.lines[id].x, canvFunc.lines[id].y);
				ctx.lineTo(x, y);
				ctx.stroke();
				ctx.closePath();
				canvFunc.lines[id] = {
					x: x,
					y: y
				};
			};
			canvas.addEventListener('mousemove', function(e) {
				canvFunc.drawFunc(e.pageX - canvas.offsetLeft, e.pageY - canvas.offsetTop, "mouse");
			});
			canvas.addEventListener('mousedown', function(e) {
				isDrawing = true;
				canvFunc.lines["mouse"] = {
					x: e.pageX - canvas.offsetLeft,
					y: e.pageY - canvas.offsetTop
				};
			});
			canvas.addEventListener('mouseup', function(e) {
				isDrawing = false;
			});
			canvas.addEventListener('touchmove', function(e) {
				e.preventDefault();
				for (var i = 0; i < e.touches.length; i++) canvFunc.drawFunc(e.touches[i].pageX - canvas.offsetLeft, e.touches[i].pageY - canvas.offsetTop, e.touches[i].identifier);
			});
			canvas.addEventListener('touchstart', function(e) {
				e.preventDefault();
				for (var i = 0; i < e.touches.length; i++) {
					isDrawingTouch[e.touches[i].identifier] = true;
					canvFunc.lines[e.touches[i].identifier] = {
						x: e.touches[i].pageX - canvas.offsetLeft,
						y: e.touches[i].pageY - canvas.offsetTop
					};
				}
			});
			canvas.addEventListener('touchend', function(e) {
				e.preventDefault();
				for (var i = 0; i < e.changedTouches.length; i++) {
					isDrawingTouch[e.changedTouches[i].identifier] = false;
					canvFunc.lines[e.changedTouches[i].identifier] = null;
				}
			});
			window.rainbow = (function() {
				var grad = ctx.createLinearGradient(0, 0, canvas.width, 0);
				grad.addColorStop(0, 'red');
				grad.addColorStop(1 / 6, 'orange');
				grad.addColorStop(2 / 6, 'yellow');
				grad.addColorStop(3 / 6, 'green');
				grad.addColorStop(4 / 6, 'aqua');
				grad.addColorStop(5 / 6, 'blue');
				grad.addColorStop(1, 'purple');
				return grad;
			})();
			canvFunc.openMenu = function() {
				var choice = parseInt(prompt("PaintJS\nMain Menu\n\nMenu Options:\n1: Change Color\n2: Change Line Width\n3: Change Alpha\n4: Clear Paint"));
				if (choice == 1) {
					window.strokeStyle = prompt("PaintJS\nChange Stroke Style\n\nInsert new color:", window.stokeStyle);
					if (window.strokeStyle.toLowerCase() == "rainbow") {
						window.strokeStyle = window.rainbow;
						alert("Stroke style was changed to: rainbow.");
					} else alert("Stroke style was changed to: " + window.strokeStyle + ".");
				} else if (choice == 2) {
					window.lineWidth = parseFloat(prompt("PaintJS\nChange Line Width\n\nInsert new line width:", window.lineWidth));
					alert("Line width was changed to: " + window.lineWidth + ".");
				} else if (choice == 3) {
					window.globalAlpha = parseFloat(prompt("PaintJS\nChange Alpha\n\nInsert new alpha:", window.globalAlpha));
					alert("Alpha was changed to: " + window.globalAlpha + ".");
				} else if (choice == 4) {
					window.ctx.drawImage(back, 0, 0);
					alert("The paint has been cleared!");
				}
			};
			document.body.addEventListener("keyup", function(event) {
				event.preventDefault();
				if (event.keyCode === 77) {
					canvFunc.openMenu();
				}
			});
			alert("[PaintJS] PaintJS has loaded successfully!\nPress this bookmark again or press 'm' to open the menu!");
		};
	}
})();