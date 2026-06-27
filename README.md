# Product Listing App

A product listing page built with Next.js and Bootstrap 5 .

## Features

- Server-Side Rendering using `getServerSideProps`
- Fetches products from [fakestoreapi.com](https://fakestoreapi.com/products)
- Search bar to filter products by name
- Category filter buttons
- Loading spinner while filtering
- Fully responsive using Bootstrap grid

## Tech Stack

- Next.js
- React
- Bootstrap 5
- Fetch API

## How to Run

npm install
npm run dev

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

pages/
  _app.js      - Bootstrap setup
  index.js     - Main product listing page
styles/
  globals.css  - Custom global styles

## API Used

Products are fetched from: `https://fakestoreapi.com/products`
