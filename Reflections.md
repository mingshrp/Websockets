Security Vulnerabilities:
There is no authentication or login system in my application, so users can enter each others usernames and impersonate each other. For XSS risks, I added "messageElem.textContent = message;" that ensures it only interprets plain text, not HTML tags. Another security vulnerability is that this application uses ws:// because it is running locally without SSL.

What I learned:
I learned how WebSockets have an ongoing connection between the browser and the server, allowing both sides to send and receive data (real-time communication). I also learned the difference between ws:// (unencrypted) and wss:// (secure). 