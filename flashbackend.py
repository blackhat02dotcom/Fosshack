from flask import Flask, request, jsonify

app = Flask(__name__)

tasks = []  # In-memory database for tasks

@app.route('/add_task', methods=['POST'])
def add_task():
    data = request.get_json()
    if not data or "title" not in data:
        return jsonify({"error": "Title is required"}), 400
    
    task = {
        "id": len(tasks) + 1,
        "title": data.get("title", "Untitled Task"),
        "deadline": data.get("deadline"),
        "priority": data.get("priority", "Medium"),
        "category": data.get("category", "General"),
    }
    tasks.append(task)
    return jsonify({"message": "Task added successfully", "task": task}), 201

@app.route('/tasks', methods=['GET'])
def get_tasks():
    return jsonify({"tasks": tasks})

@app.route('/suggest_schedule', methods=['POST'])
def suggest_schedule():
    data = request.get_json()
    available_hours = data.get("available_hours", 4)
    
    if not tasks:
        return jsonify({"schedule": "No tasks available to schedule."})
    
    allocated_time = max(1, available_hours // len(tasks))
    suggestions = [{"task": task["title"], "allocated_time": f"{allocated_time} hours"} for task in tasks]
    
    return jsonify({"schedule": suggestions})

@app.route('/break_reminder', methods=['GET'])
def break_reminder():
    return jsonify({"message": "Time to take a short break!"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)
