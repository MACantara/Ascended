from flask import Blueprint, jsonify, request
import json
import os

bp = Blueprint('challenges', __name__, url_prefix='/api/challenges')

@bp.route('/<challenge_type>/<challenge_id>')
def get_challenge(challenge_type, challenge_id):
    """Get challenge data"""
    challenge_file = os.path.join('data', 'challenges', challenge_type, f'{challenge_id}.json')
    if os.path.exists(challenge_file):
        with open(challenge_file, 'r') as f:
            challenge_data = json.load(f)
        return jsonify(challenge_data)
    return jsonify({'error': 'Challenge not found'}), 404

@bp.route('/<challenge_type>/<challenge_id>/validate', methods=['POST'])
def validate_challenge(challenge_type, challenge_id):
    """Validate challenge solution"""
    data = request.get_json()
    
    # Load challenge solution
    challenge_file = os.path.join('data', 'challenges', challenge_type, f'{challenge_id}.json')
    with open(challenge_file, 'r') as f:
        challenge_data = json.load(f)
    
    # Simple validation logic (expand based on challenge type)
    is_correct = data.get('answer') == challenge_data.get('solution')
    
    return jsonify({
        'correct': is_correct,
        'feedback': challenge_data.get('feedback', {}).get('correct' if is_correct else 'incorrect', '')
    })

@bp.route('/<challenge_type>/<challenge_id>/hint')
def get_hint(challenge_type, challenge_id):
    """Get progressive hints for challenge"""
    level = request.args.get('level', 1, type=int)
    
    challenge_file = os.path.join('data', 'challenges', challenge_type, f'{challenge_id}.json')
    with open(challenge_file, 'r') as f:
        challenge_data = json.load(f)
    
    hints = challenge_data.get('hints', [])
    if level <= len(hints):
        return jsonify({'hint': hints[level-1]})
    
    return jsonify({'error': 'No more hints available'}), 404
