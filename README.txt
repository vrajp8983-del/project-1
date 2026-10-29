ATTENDAI — STUDENT ONLINE ATTENDANCE DEMO

FILES
- index.html: page structure and login/dashboard
- style.css: responsive website styling
- script.js: demo login, camera permission, and local attendance history

HOW TO RUN
1. Extract the ZIP folder.
2. Open the folder in Visual Studio Code.
3. Recommended: install the "Live Server" extension.
4. Right-click index.html and choose "Open with Live Server".
5. Use the demo login below.

DEMO LOGIN
Student ID: student
Password: 123456
You can also use student@college.edu as the ID.

CAMERA NOTES
- The camera starts only after the user clicks "Start camera" and grants permission.
- Camera APIs generally require HTTPS or localhost. Use Live Server rather than opening the HTML as a file if camera access fails.
- Stop camera to turn it off.
- This is a front-end learning demo, not a real AI face-recognition system. The attendance button marks a demo record in this browser's localStorage.
- For real deployment, add a secure backend, password hashing, a database, student/admin roles, consent and privacy controls, and a real face-verification model with anti-spoofing. Never use a browser-only demo as official attendance.
