let history = [];

function press(val) {
    let display = document.getElementById("display");

    // Auto-add closing bracket for functions
    if (["sin(", "cos(", "tan(", "log(", "sqrt("].includes(val)) {
        display.value += val;
    } else {
        display.value += val;
    }
}

function clearDisplay() {
    document.getElementById("display").value = "";
}

function calculate() {
    let display = document.getElementById("display");
    let expr = display.value;

    // 🔥 Auto-close missing brackets
    let open = (expr.match(/\(/g) || []).length;
    let close = (expr.match(/\)/g) || []).length;

    while (open > close) {
        expr += ")";
        close++;
    }

    fetch("/calculate", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({expression: expr})
    })
    .then(res => res.json())
    .then(data => {
        display.value = data.result;

        history.push(expr + " = " + data.result);
        updateHistory();
    })
    .catch(err => {
        alert("Error in calculation");
    });
}

function updateHistory() {
    let list = document.getElementById("historyList");
    list.innerHTML = "";
    history.slice(-5).reverse().forEach(item => {
        let li = document.createElement("li");
        li.textContent = item;
        list.appendChild(li);
    });
}

// 🎹 Keyboard support
document.addEventListener("keydown", function(e) {
    if (!isNaN(e.key) || "+-*/.".includes(e.key)) {
        press(e.key);
    }
    if (e.key === "Enter") calculate();
    if (e.key === "Backspace") {
        let d = document.getElementById("display");
        d.value = d.value.slice(0, -1);
    }
});

// 🎤 Voice input
function startVoice() {
    let recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.start();

    recognition.onresult = function(event) {
        let text = event.results[0][0].transcript;
        document.getElementById("display").value = text;
    };
}

// 🌙 Theme toggle
function toggleTheme() {
    document.body.classList.toggle("light");
}

// 📊 Graph plotting (y = x^2 style input)
let chart = null;  // global

function plotGraph() {
    let expr = document.getElementById("display").value;

    let x = [];
    let y = [];

    for (let i = -10; i <= 10; i++) {
        try {
            let val = eval(expr.replace(/x/g, i));
            x.push(i);
            y.push(val);
        } catch {
            alert("Invalid for graph");
            return;
        }
    }

    // 🔥 destroy old chart before creating new one
    if (chart) {
        chart.destroy();
    }

    chart = new Chart(document.getElementById("graph"), {
        type: "line",
        data: {
            labels: x,
            datasets: [{
                label: "Graph",
                data: y
            }]
        }
    });
}