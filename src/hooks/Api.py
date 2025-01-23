from flask import Flask, jsonify
from flask_cors import CORS
import chess
import chess.engine
import tensorflow as tf

app = Flask(__name__)
CORS(app)

model = tf.keras.models.load_model('chess_model.h5')

@app.route('/api/puzzles/random')
def get_random_puzzle():

    return jsonify({
        'id': 'puzzle1',
        'fen': 'initial_position',
        'rating': 1500,
        'moves': ['e2e4', 'e7e5'],
        'theme': ['tactics', 'pin'],
        'description': 'Find the winning tactical sequence'
    })

@app.route('/api/tips')
def get_tips():
    #To generate personalized tips
    return jsonify([{
        'id': 'tip1',
        'category': 'opening',
        'title': 'Control the Center',
        'content': 'Focus on controlling the central squares...',
        'difficulty': 'beginner'
    }])

@app.route('/api/analyze')
def analyze_position():
    # To analyze the position
    return jsonify({
        'evaluation': 0.5,
        'best_move': 'e2e4',
        'explanation': 'Controls the center and develops quickly'
    })

if __name__ == '__main__':
    app.run(debug=True)
