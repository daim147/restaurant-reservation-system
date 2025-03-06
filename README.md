# Restaurant Reservation System

A Vue.js application that allows restaurant owners to manage reservation settings across multiple locations.

- View all branches with reservations enabled
- Disable reservations for individual branches or all branches at once

![Restaurant Reservation System](./screenshots/app-screenshot.png)

## Overview

This single-page application helps restaurant owners configure their reservation system across multiple branches. Each branch can have reservations enabled or disabled, and when enabled, specific settings can be configured:

- **Reservation Duration**: The number of minutes a reservation is expected to last
- **Tables**: Which tables within the branch are open for reservations
- **Time Slots**: Available time slots for each day of the week (up to 3 per day)

## Features

### Branch Management

- Add new branches to reservation system

![Branch Listing](./screenshots/add-branch.png)
_Listing page showing all branches with enabled reservations_

### Branch Settings

- Configure reservation duration per branch
- Set up time slots for each day of the week
- Copy time slot configuration from Saturday to all other days with a single click

![Settings Form](./screenshots/branch-setting.png)
_Branch reservation settings configuration_

### Time Slot Management

- Add, edit and delete time slots for each day
- Up to 3 time slots per day
- Intuitive time slot editing interface

![Time Slot Editing](./screenshots/time-slots.png)
_Editing a time slot for a specific day_

## Technical Details

### Architecture

- Built with Vue.js 2
- State management with Vuex
- API communication with Foodics API

### API Integration

The application integrates with Foodics API to manage restaurant branch data:

- Fetch branches with tables and sections
- Update branch reservation settings
- Enable/disable reservations for branches

## Getting Started

### Prerequisites

- Node.js (v10 or later)
- npm or yarn

### Installation

1. Clone the repository
