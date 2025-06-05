from flask import Blueprint, render_template, jsonify
import json
import os

bp = Blueprint('game', __name__, url_prefix='/api/game')

@bp.route('/rooms')
def get_rooms():
    """Get all available rooms and their unlock status"""
    rooms_file = os.path.join('data', 'rooms.json')
    with open(rooms_file, 'r') as f:
        rooms_data = json.load(f)
    return jsonify(rooms_data)

@bp.route('/room/<room_id>')
def get_room(room_id):
    """Get specific room data and available challenges"""
    room_file = os.path.join('data', f'{room_id}.json')
    if os.path.exists(room_file):
        with open(room_file, 'r') as f:
            room_data = json.load(f)
        return jsonify(room_data)
    return jsonify({'error': 'Room not found'}), 404
