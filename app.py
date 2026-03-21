from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
CORS(app)

# Database config
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///expenses.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Model
class Expense(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    amount = db.Column(db.Float, nullable=False)
    category = db.Column(db.String(100), nullable=False)
    date = db.Column(db.String(100), nullable=False)

# Create DB
with app.app_context():
    db.create_all()

# Add expense
@app.route('/add', methods=['POST'])
def add_expense():
    data = request.json
    new_expense = Expense(
        amount=float(data['amount']),
        category=data['category'],
        date=data['date']
    )
    db.session.add(new_expense)
    db.session.commit()
    return jsonify({"message": "Added"})

# Get all expenses
@app.route('/get', methods=['GET'])
def get_expenses():
    expenses = Expense.query.all()
    result = []
    for e in expenses:
        result.append({
            "id": e.id,
            "amount": e.amount,
            "category": e.category,
            "date": e.date
        })
    return jsonify(result)

# Delete expense
@app.route('/delete/<int:id>', methods=['DELETE'])
def delete_expense(id):
    expense = Expense.query.get(id)
    if expense:
        db.session.delete(expense)
        db.session.commit()
        return jsonify({"message": "Deleted"})
    return jsonify({"error": "Not found"}), 404

if __name__ == "__main__":
    app.run()