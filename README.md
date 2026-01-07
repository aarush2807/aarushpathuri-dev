aarushpathuri.dev

A minimalist, typography-focused personal portfolio and blog built with React and Tailwind CSS. This site serves as a space to explore the intersection of sports analytics, finance, and storytelling.

✨ Features

Dynamic Weather System: Interactive rain and snow effects rendered on a custom HTML5 Canvas particle system.

Tri-Theme Architecture: Seamlessly toggle between Light, Dark, and Sunset modes.

JSON-Driven Content: Blog posts and film reviews are decoupled from logic, powered by src/posts.json and src/films.json.

Client-Side Routing: Full multi-page experience with deep-linking support via react-router-dom.

Privacy First: Zero trackers, zero analytics, zero cookies.

Responsive Design: Fully optimized for mobile, tablet, and desktop viewing.

🛠️ Tech Stack

Framework: React

Styling: Tailwind CSS

Icons: Lucide React

Routing: React Router

Deployment: Vercel

🚀 Getting Started

Prerequisites

Node.js (v16 or higher)

npm or yarn

Installation

Clone the repository:

git clone [https://github.com/aarush2807/aarushpathuri-dev.git](https://github.com/aarush2807/aarushpathuri-dev.git)
cd aarushpathuri-dev


Install dependencies:

npm install


Start the development server:

npm start


📂 Project Structure

src/App.js: Main application logic and routing.

src/posts.json: The database for all blog articles.

src/films.json: The database for movie reviews and ratings.

src/index.js: Entry point and BrowserRouter setup.

public/index.html: Base HTML with custom font loading and Tailwind configuration.

✍️ Adding Content

Adding a Blog Post

Add a new object to src/posts.json:

{
  "id": "unique-slug",
  "date": "Month Day, Year",
  "title": "Your Title",
  "readTime": "X min read",
  "description": "Short summary for the home page.",
  "content": "Full article text here..."
}


Adding a Film Review

Add a new object to src/films.json:

{
  "id": "movie-slug",
  "title": "Movie Title",
  "year": "202X",
  "rating": 4.5,
  "image": "Direct link to poster image",
  "review": "Your reflections on the film."
}


🔒 Privacy

This site is built to be a fast, static experience. It does not collect any user data, use cookies, or perform any tracking.

📄 License

This project is open-source. Feel free to use it as inspiration for your own personal site.

Built by Aarush Pathuri
