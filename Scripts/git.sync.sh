#!/bin/bash

# --- 1. Get Commit Message ---

# Set a default message
DEFAULT_MESSAGE="Cleaning up files/sync from local to web"

# Prompt user for input
echo "Enter commit message (or press Enter to use default):"
read -r USER_MESSAGE

# Use the default message if user input is empty
if [ -z "$USER_MESSAGE" ]; then
    COMMIT_MESSAGE="$DEFAULT_MESSAGE"
else
    COMMIT_MESSAGE="$USER_MESSAGE"
fi

echo "--- Using commit message: \"$COMMIT_MESSAGE\" ---"

# --- 2. Git Operations ---

# Stage all changes (additions, modifications, deletions)
echo "Staging all changes..."
git add -A

# Commit staged changes
echo "Committing staged changes..."
git commit -m "$COMMIT_MESSAGE"

# Check if the commit was successful before pushing
if [ $? -ne 0 ]; then
    echo "ERROR: Commit failed. Check git status for details."
    exit 1
fi

# Push to the remote main branch
echo "Pushing changes to origin main..."
git push origin main
