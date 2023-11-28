import math, random
from flask import Flask, request, render_template, jsonify
app = Flask(__name__)

@app.route('/')
def hello():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True, port=5000, host="0.0.0.0")