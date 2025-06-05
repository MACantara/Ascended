from flask import Blueprint, jsonify, request

bp = Blueprint('progress', __name__, url_prefix='/api/progress')

@bp.route('/badges')
def get_badges():
    """Get available badges and achievements"""
    badges = [
        {'id': 'debug_hero', 'name': 'Debug Hero', 'description': 'Complete 5 coding challenges'},
        {'id': 'crypto_cracker', 'name': 'Crypto Cracker', 'description': 'Solve all cybersecurity puzzles'},
        {'id': 'network_ninja', 'name': 'Network Ninja', 'description': 'Master networking challenges'},
        {'id': 'hardware_hero', 'name': 'Hardware Hero', 'description': 'Complete hardware diagnostics'},
        {'id': 'ai_architect', 'name': 'AI Architect', 'description': 'Train successful AI models'}
    ]
    return jsonify(badges)
