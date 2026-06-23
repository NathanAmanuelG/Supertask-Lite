# Supertask Lite

A simple React Native task manager app built with Expo. Built as a technical task for PRITECH.

## Features

- View a list of personal tasks
- Add a new task with a title and description
- Mark a task as completed or not completed
- Delete a task
- View task details
- Basic input validation (title cannot be empty)
- Search tasks by title
- Filter tasks by status (All / Active / Completed)
- Tasks are saved locally on the device using AsyncStorage
- Import sample tasks from a public API (JSONPlaceholder)

## Tech stack

- React Native (Expo)
- JavaScript
- React Navigation
- AsyncStorage

## Setup instructions

1. Install Node.js (LTS version) if you don't already have it.
2. Install the Expo Go app on your phone from the App Store or Google Play.
3. Clone this repository:
   git clone <repo-url>
   cd <folder-name>
4. Install dependencies:
   npm install
5. Start the project:
   npx expo start
6. Scan the QR code shown in the terminal with the Expo Go app on your phone.

## What was implemented

This app lets a user manage a small list of personal tasks. Tasks are added through a form with title and description fields, with validation that blocks an empty title. Each task can be marked complete or not completed, and deleted from its details screen. Task data is stored centrally using React Context and persisted on the device with AsyncStorage, so it survives the app being fully closed and reopened. A search bar filters tasks by title in real time, and three filter chips (All, Active, Completed) narrow the list by status. The app also includes a button that fetches sample tasks from a public API (JSONPlaceholder) and adds them directly into the real task list.

## Notes

- Built entirely with functional components and hooks (useState, useEffect, useContext).
- Navigation between the three screens is handled with React Navigation.
