from flask import Flask, render_template, jsonify, request
from flask_cors import CORS
import json
import os

app = Flask(__name__)
CORS(app)

# Import route modules
from routes import game_routes, challenge_routes, progress_routes

# Register blueprints
app.register_blueprint(game_routes.bp)
app.register_blueprint(challenge_routes.bp)
app.register_blueprint(progress_routes.bp)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/lab')
def lab():
    return render_template('lab.html')

@app.route('/game')
def game():
    return render_template('game.html')

if __name__ == '__main__':
    app.run(debug=True)
