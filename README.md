## Bitcamp 2025 - PRI$M
Focusing the scattered rays of financial markets—where stock data, news, and economic signals converge into one clear, educational perspective.

# for setup
chmod +x setup.sh && ./setup.sh

## Inspiration
Our economic situation is, more than anything, confusing. Though downturns have not been uncommon in recent history, the level of misinformation and disinformation has never been higher, including from family and friends. 93% of stocks are owned by 10%- the ones who can afford to take the time to understand how finances and markets work. But for the other 90%, most of whom are told their money is safe in an index fund, are now seeing those funds fluctuating in orders of tens of thousands of dollars by the **hour**, and they have no idea why. PRI$M is a tool for these people- for college students who don’t know why it’s so hard to find a job right now, for parents of those college students who are struggling to make sense of the value of the college fund they’ve spent the last ten years building, for near-retirement workers who may be forced to work five more years. It is a tool that won’t solve these problems for them, but they’ll be able to understand what’s causing them, and hopefully, doing so will make the future a little less uncertain.

## What it does
PRI$M is an educational finance web app that leverages the most recent data available about **every single company** to show the user recent stock price history, along with a bunch of important metrics, like any other stock display. But unlike other chart displays, PRI$M understands that many of its users may not know what a P/E ratio or a trade war is- and why it could affect them. And so, for every single stock, PRI$M displays a concise summary of all the most recent news (within the past month) of that company and how it could be affecting the price of its stock, as well as a general overview of what factors drive the company’s potential success or failure. Then, it enables the users to either choose from a list of questions relevant to the information they just learned or to ask something of their own. PRI$M also takes a minimalist approach to UI design. Unlike traditional stock apps filled with flashing green and red indicators, PRI$M avoids color-based buy/sell cues. This is intentional: we want users to focus on understanding economic forces rather than reacting emotionally to short-term price movements. The goal is education and clarity, not panic or hype.

## How we built it
We built PRI$M using a MERN stack with a MongoDB database to handle and store previously called articles in a cache to minimize API calls and to make retrieval faster. Express.js handles the routing, Node was used for the backend, and React in the frontend. NewsAPI was used to get the most recent news articles. A couple of finance APIs were used, including yahoo-finance2 for ticker lookup, Finnhub for real-time stock price, company profile, and basic financials, and Tiingo for displaying historical data. Gemini was used to generate the news summaries and handle user Q&A.

## Challenges we ran into
We ran into numerous challenges, including turning a user input into something that could retrieve many relevant news articles, figuring out how to upload a schema to MongoDB, figuring how to use Node and Express for backend and routing for the first time, and displaying information in an informative, but not overwhelming way on the UI.

## Accomplishments that we're proud of
We’re proud of hitting every target that we set out for ourselves. We created a tool that can display relevant stock information and, regardless of how popular the stock is, find relevant news that allows the user to learn about the stock and further interact with it. We’re very proud of successfully using a full JavaScript stack for the first time. We’ve both wanted to work with Express and Mongoose for a while, and a project as challenging as this was absolutely the best way to dip our toes.

## What we learned
We learned about a variety of extremely useful APIs for both information and finance-specific data. We learned about the value of creating multiple LLM agents for different tasks instead of asking one to handle all of them to reduce token usage. We learnt how to work with MongoDB using self-made schemas and using mongoose to leverage JavaScript object properties to make it work. 

## What's next for PRI$M
There are many areas for improvement. Expanding the sources of data from which information is gathered is the first. Higher volume web scraping and more complex financial data might help build a more precise picture. Additionally, asynchronous updates of the database once every day would minimize costs in calling the LLM and maximize speed in retrieval.

