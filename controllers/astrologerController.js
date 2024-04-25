const fs = require('fs');
const path = require('path');
const usersData = require('../data/users');
let astrologersData = require('../data/astrologers'); // Import astrologers data

const User = require('../models/user');
const Astrologer = require('../models/astrologer');

// Logic to assign a user to an astrologer
function assignUser(req, res) {
    const { userId } = req.body;

    // Find the astrologer with the minimum flow (fair distribution)
    let minFlowAstrologer = astrologersData[0];
    for (let i = 1; i < astrologersData.length; i++) {
        if (astrologersData[i].flow < minFlowAstrologer.flow) {
            minFlowAstrologer = astrologersData[i];
        }
    }

    // Increase flow for the assigned astrologer
    minFlowAstrologer.flow++;

    // Assign the user to the astrologer
    const assignedAstrologerName = minFlowAstrologer.name;

    // Update the assigned astrologer's flow in the astrologers data
    const updatedAstrologersData = astrologersData.map(astrologer => {
        if (astrologer.id === minFlowAstrologer.id) {
            return {
                ...astrologer,
                flow: astrologer.flow + 1
            };
        }
        return astrologer;
    });

    // Update the user's assigned astrologer in the users data
    const updatedUsersData = usersData.map(user => {
        if (user.id === userId) {
            return {
                ...user,
                assignedAstrologer: assignedAstrologerName // Update assignedAstrologer value with astrologer's name
            };
        }
        return user;
    });

    // Write the updated astrologer data back to data/astrologers.js
    fs.writeFile(path.join(__dirname, '../data/astrologers.js'), 'module.exports = ' + JSON.stringify(updatedAstrologersData), err => {
        if (err) {
            console.error('Error writing astrologer data:', err);
            res.status(500).json({ message: 'Failed to assign user to astrologer' });
        } else {
            // Write the updated user data back to data/users.js
            fs.writeFile(path.join(__dirname, '../data/users.js'), 'module.exports = ' + JSON.stringify(updatedUsersData), err => {
                if (err) {
                    console.error('Error writing user data:', err);
                    res.status(500).json({ message: 'Failed to assign user to astrologer' });
                } else {
                    // Return success response with assigned astrologer name
                    res.status(200).json({ message: 'User assigned to astrologer successfully', assignedAstrologerName });
                }
            });
        }
    });
}

// Logic to create a new astrologer and add to data/astrologers.js
function createAstrologer(req, res) {
    const { id, name } = req.body;
    const newAstrologer = new Astrologer(id, name);
    
    // Add the new astrologer to the array
    astrologersData.push(newAstrologer);
    
    // Write the updated astrologer data back to data/astrologers.js
    fs.writeFile(path.join(__dirname, '../data/astrologers.js'), 'module.exports = ' + JSON.stringify(astrologersData), err => {
        if (err) {
            console.error('Error writing astrologer data:', err);
            res.status(500).json({ message: 'Failed to create astrologer' });
        } else {
            res.status(201).json({ message: 'Astrologer created successfully', astrologer: newAstrologer });
        }
    });
}

// Logic to create a new user and add to data/users.js
function createUser(req, res) {
    const { id, name } = req.body;
    const newUser = new User(id, name);
    
    // Add the new user to the array
    usersData.push(newUser);
    
    // Write the updated user data back to data/users.js
    fs.writeFile(path.join(__dirname, '../data/users.js'), 'module.exports = ' + JSON.stringify(usersData), err => {
        if (err) {
            console.error('Error writing user data:', err);
            res.status(500).json({ message: 'Failed to create user' });
        } else {
            res.status(201).json({ message: 'User created successfully', user: newUser });
        }
    });
}

// Logic to get all users and their assigned astrologers
function getUsersWithAstrologers(req, res) {
    const updatedUsersData = require('../data/users'); // Import updated users data
    const usersWithAstrologers = updatedUsersData.map(user => {
        const assignedAstrologer = astrologersData.find(astrologer => astrologer.id === user.assignedAstrologer);
        return {
            user: user,
            assignedAstrologer: assignedAstrologer ? assignedAstrologer : null
        };
    });
    res.status(200).json(usersWithAstrologers);
}

module.exports = {
    assignUser,
    createAstrologer,
    createUser,
    getUsersWithAstrologers
};
