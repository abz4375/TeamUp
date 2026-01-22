
import sqlite3
import os

db_path = r'd:\abz4375\gitRepos\team-up\team_up_v2\packages\db\dev.db'

if not os.path.exists(db_path):
    print(f"Error: Database file not found at {db_path}")
    exit(1)

try:
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = cursor.fetchall()
    print("Tables found in database:")
    for table in tables:
        print(f"- {table[0]}")
    
    conn.close()
except Exception as e:
    print(f"Error reading database: {e}")
