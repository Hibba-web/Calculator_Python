from flask import Flask, render_template, request, jsonify
import math

app = Flask(__name__)

def calculate(expr):
    try:
        allowed = {
            "sin": math.sin,
            "cos": math.cos,
            "tan": math.tan,
            "log": math.log10,
            "sqrt": math.sqrt,
            "pi": math.pi,
            "e": math.e
        }
        return eval(expr, {"__builtins__": None}, allowed)
    except:
        return "Error"

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/calculate", methods=["POST"])
def calc():
    expr = request.json["expression"]
    result = calculate(expr)
    return jsonify({"result": str(result)})

if __name__ == "__main__":
    app.run(debug=True)