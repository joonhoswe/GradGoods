# 🎓 GradGoods 

♻️  Reduce Waste. <br/>
💰 Save Money. <br/>
👥 Foster Community. <br/>

Every year, over 640 pounds of waste are trashed by college students that are moving out. That's equivalent to nearly 10 bags of cement or a grand piano. According to the National Retail Federation (NRF), back-to-college spending is nearly $1,400 per student. These are astounding numbers, and when multiplied by the over 18 million college students present in the U.S., the severity of this problem becomes quickly apparent. 

The current solution for this idea? Outdated facebook groups filled with scammers, QR codes linked to google slides posted around buildings, and word of mouth. None of which are secure nor effective for students who need to purchase dorm essentials sustainably, especially those who may be traveling from across the country or even the world.

This all changes today, with GradGoods.

GradGoods solves this issue by providing a centralized, secure, and intuitive platform for college students both moving in and out of dorms, to securely and quickly buy and sell dorm essentials. GradGoods enforces valid .edu emails only, by leveraging Clerk Authentication. GradGoods also leverages ChatGPT to accurately estimate how many pounds of waste each seller has reduced by selling their items. By saving money for incoming students, returning money back to upperclassmen moving out, and reducing waste, GoodGrads is THE solution for this crisis.


## Tech Stack
Frontend: React + Vite + TailwindCSS <br/>
Backend: Django + Python <br/>
Database: SQLite <br/>
External APIs/Libraries: Clerk Auth, OpenAI (GPT 4o-mini model for calculating waste savings), ChakraUI, Axios <br/>

## Running the Website:
### Frontend:
`npm install` <br/>
`npm run dev`  <br/>

### Backend:
`cd backend ` <br/>
`pip install -r requirements.txt ` <br/>
`python manage.py makemigrations`  <br/>
`python manage.py migrate`  <br/>
`python manage.py runserver ` <br/>

You're all set!



