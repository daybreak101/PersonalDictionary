# Personal Dictionary

A Dictionary app where users can discover new English words and add them to their personal dictionary to track their personal vocabulary journey! Best suited for readers who find themselves encountering new words that are not yet in their vocabulary.

## Why This Project
While reading as a hobby, it is common to come across many unfamiliar or repeatedly forgotten words. The goal is to create an app that would simplify the learning process of discovering, saving, and revisiting new words, and keep readers reading. It also serves as an engaging way to build a record of their vocabulary progress.

## Features

### Search Screen
- Look up words to view their dictionary information. If available, this information includes:
    * Definitions
    * Part of Speech
    * Synonyms
    * Antonyms
    * Pronunciation (audio)
- Save a word's dictionary info locally to the device
- Recent searches with swipe-to-delete
- Randomized "Word Of The Day"

### My Words Screen
- Review saved words in a list with swipe-to-delete
- Search bar to look up a saved word
- Filter options:
     * Has Quotes
     * Has Pronunciation
     * Has Synonyms/Antonyms
     * Includes any of the following selected Parts of Speech:
          * Noun
          * Pronoun
          * Verb
          * Adjective
          * Adverb
          * Preposition
          * Conjuction
          * Interjection
          * Other
- Sort options:
     * Newest
     * Oldest
     * Alphabetical
     * Reverse Alphabetical
     * Longest
     * Shortest
- An expanded word view with:
     * Saved dictionary details
     * User-added literary quotes that includes title and author.
     * Swipe to reveal delete and edit buttons to each quote.
  
### Settings Screen
- Theme Selector
- Dark Mode
- Haptic Feedback
- Clear all recent searches
- Clear all saved words

## Technologies Used
- JavaScript
- React
- React Native
- Expo
- AsyncStorage
- External Dictionary API
     * https://dictionaryapi.dev/

## Getting Started
If you would like to use this app and build upon it, please fork the repository.

## Project Status & Roadmap
This project is a work in progress. Planned features and fixes includes:
- [ ] Swipe to reveal state to only have one revealed at a time
- [ ] Ability to save multiple definitions of the same word

## Future Aspirations
These are features I've considered but are unlikely to be implemented in the near future:
- [ ] Randomized quizzes based on user's saved words
- [ ] Cloud Storage
- [ ] Filter by: Favorites; tapping a star UI icon to add/remove from favorites
- [ ] Sort by: Frequency; based on how many times a user expanded the word view of that word.
