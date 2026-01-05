/*
 * File: projects.js
 * Student: Prosper Alabi
 * Student ID: 300833841
 * Date: June 02,2023
 */

// Adding  routes for Projects page

const express = require("express");
const router = express.Router();

// Projects data with GitHub repositories
const projects = [
  {
    title: "Toronto KSI Accident Classification Model",
    description: "Machine learning model for classifying Toronto traffic accidents using the KSI (Killed or Seriously Injured) dataset. Includes API implementation for real-time accident classification and analysis.",
    githubUrl: "https://github.com/Prisoe/Machine_Learning/tree/main/Toronto%20Accident%20Classification%20Model/API",
    image: "images/work-1.png",
    category: "Machine Learning"
  },
  {
    title: "Software Salary Prediction App",
    description: "Machine learning model that predicts software engineer salaries worldwide based on criteria like education, experience, and location. Uses multiple predictive models to minimize error margins.",
    githubUrl: "https://github.com/Prisoe/Machine_Learning/tree/main/Software%20predictor%20Project/Group2COMP377Project",
    image: "images/work-3.png",
    category: "Machine Learning"
  },
  {
    title: "Traffic Accident Model (Docker)",
    description: "Containerized version of the Toronto traffic accident classification model using Docker. Includes API endpoints for accident prediction and analysis with full deployment configuration.",
    githubUrl: "https://github.com/Prisoe/Traffic_Accident_Model",
    image: "images/work-1.png",
    category: "DevOps"
  },
  {
    title: "Voice Journal App",
    description: "A voice-powered journaling application that allows users to record and manage their daily entries using voice input. Features speech-to-text conversion and journal organization.",
    githubUrl: "https://github.com/Prisoe/Voice_Journal_App",
    image: "images/work-2.png",
    category: "Web Application"
  },
  {
    title: "Trading Signal Bot Generator",
    description: "Automated trading signal generator that analyzes market data and generates trading signals. Built with advanced algorithms for pattern recognition and market trend analysis.",
    githubUrl: "https://github.com/Prisoe/Cursor_Repo",
    image: "images/work-2.png",
    category: "Automation"
  },
  {
    title: "Sentiment Analysis Algorithm",
    description: "Advanced sentiment analysis algorithm that processes text data to determine emotional tone and sentiment. Useful for social media monitoring, customer feedback analysis, and market research.",
    githubUrl: "https://github.com/Prisoe/Sentiment_Algorithm",
    image: "images/work-3.png",
    category: "NLP"
  },
  {
    title: "Ticketing Triaging App",
    description: "Intelligent ticketing system that automatically categorizes and routes support tickets using keyword analysis and machine learning. Improves response times and ticket organization.",
    githubUrl: "https://github.com/Prisoe/KeywordsAPI",
    image: "images/work-1.png",
    category: "API"
  },
  {
    title: "Python Learning Projects",
    description: "Collection of Python projects including automation bots (LinkedIn, Indeed, Instagram, Twitter), web scraping, OOP projects, and various programming challenges. Learning journey from basics to advanced topics.",
    githubUrl: "https://github.com/Prisoe/My-Projects",
    image: "images/work-2.png",
    category: "Python",
    subProjects: [
      {
        title: "Day 15 Coffeemaker OOP",
        url: "https://github.com/Prisoe/My-Projects/tree/main/Day%2015%20Coffeemaker%20OOP"
      },
      {
        title: "Day 16",
        url: "https://github.com/Prisoe/My-Projects/tree/main/Day%2016"
      },
      {
        title: "Day 44 Intermediate CSS",
        url: "https://github.com/Prisoe/My-Projects/tree/main/Day%2044%20Intermediate%20CSS"
      },
      {
        title: "Day 45 Website Parsing",
        url: "https://github.com/Prisoe/My-Projects/tree/main/Day%2045%20Website%20parcing"
      },
      {
        title: "Day 49 Indeed Web Selenium Driver",
        url: "https://github.com/Prisoe/My-Projects/tree/main/Day%2049%20Indeed%20Web%20selenium%20driver"
      },
      {
        title: "Day 50 Tinder Bot",
        url: "https://github.com/Prisoe/My-Projects/tree/main/Day%2050%20Tinder%20Bot!!!"
      },
      {
        title: "Day 51 Twitter Bot",
        url: "https://github.com/Prisoe/My-Projects/tree/main/Day%2051%20Twitter%20Bot"
      },
      {
        title: "Day 52 Instagram Follower Bot",
        url: "https://github.com/Prisoe/My-Projects/tree/main/Day%2052%20Instgram%20Follower%20Bot"
      },
      {
        title: "Caesar Cypher Program",
        url: "https://github.com/Prisoe/My-Projects/blob/main/Ceaser%20Cypher%20Program.py"
      },
      {
        title: "Highest Bidder",
        url: "https://github.com/Prisoe/My-Projects/blob/main/Highest%20Bidder.py"
      },
      {
        title: "Hirst Project",
        url: "https://github.com/Prisoe/My-Projects/blob/main/Hirst-Project.py"
      },
      {
        title: "Spirograph",
        url: "https://github.com/Prisoe/My-Projects/blob/main/Spirograph.py"
      }
    ]
  }
];

// Define the route handlers
router.get("/", (req, res) => {
  // Render projects page with project data
  res.render("projects", { projects: projects });
});

// Export the router
module.exports = router;
