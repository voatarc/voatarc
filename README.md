

# voatarc

Project to gather submissions and comments from a Voat subverse for archival purposes.

This system scrapes and archives the submissions/posts and comments for a voat subverse.


## Scripts

There are two scripts which need to run to generate the archive for a subverse.


### 1. voatarc-1-build-index.js

This script builds a list of all submissions/posts found for a subverse and stores
that as an index file called `submission-index.json`:

	{
	    "submission_id": "1485775",
	    "title": "Anti-Trump Elector Chris Suprun Paid For Ashley Madison While Bankrupt And Married With 3 Kids",
	    "timestamp": "12/14/2016 1:19:12 AM",
	    "username": "knightwarrior41",
	    "submission_url": "https://voat.co/v/news/1485775",
	    "thumbnail_url": "",
	    "up_votes": "81",
	    "down_votes": "3"
	},
	{
	    "submission_id": "1486018",
	    "title": "IBM unveils plan to hire 25,000 in US on eve of Trump meeting",
	    "timestamp": "12/14/2016 2:56:36 AM",
	    "username": "pcdude",
	    "submission_url": "https://voat.co/v/news/1486018",
	    "thumbnail_url": "https://cdn.voat.co/thumbs/44db67d2-c375-41cf-9a6f-42bccfa215e8.jpg",
	    "up_votes": "31",
	    "down_votes": "0"
	},
	... and so on ...


### 2. voatarc-2-scrape-submissions.js

This script will read through the `submission-index.json` file and retrieve the
detail and comments for each submission. Submission comments are stored with the
submission detail data in a single file `submission_id.json`:

	{
	    "submission_id": "1486018",
	    "title": "IBM unveils plan to hire 25,000 in US on eve of Trump meeting",
	    "timestamp": "12/14/2016 2:56:36 AM",
	    "username": "pcdude",
	    "submission_text": "",
	    "submission_link": "http://www.dailymail.co.uk/wires/afp/article-4031186/IBM-unveils-plan-hire-25-000-US-eve-Trump-meeting.html",
	    "vote_score": "32",
	    "comment_count": "8",
	    "comments": [
	        {
	            "comment_id": "7217276",
	            "parent_comment_id": "",
	            "submission_id": "1486018",
	            "timestamp": "12/14/2016 3:41:00 AM",
	            "username": "Daeshaniqua",
	            "up_votes": "3",
	            "down_votes": "0",
	            "vote_score": "3",
	            "comment_text": "better cock block them h1b visa cunts from coming in "
	        },
	        {
	            "comment_id": "7217637",
	            "parent_comment_id": "7217276",
	            "submission_id": "1486018",
	            "timestamp": "12/14/2016 4:09:27 AM",
	            "username": "MrPong",
	            "up_votes": "0",
	            "down_votes": "0",
	            "vote_score": "0",
	            "comment_text": "https://www.youtube.com/watch?v=QGE23Uykd1Y"
	        },
	        {
	            "comment_id": "7217513",
	            "parent_comment_id": "",
	            "submission_id": "1486018",
	            "timestamp": "12/14/2016 3:59:34 AM",
	            "username": "50hurtz",
	            "up_votes": "2",
	            "down_votes": "0",
	            "vote_score": "2",
	            "comment_text": "So far Trump for the most part has been winning and bringing jobs back left and right! Lets hope he's really on our side and stays on it."
	        },
	... and so on ...


### Installation

This project uses [PhantomJS](http://phantomjs.org/)
and [CasperJS](http://casperjs.org/).

If you already have NPM, you can do the following.
Otherwise, consult the above links to view specific installation instructions
from each project's website.

	npm install phantomjs --global
	npm install casperjs --global


### Usage

Running this command will create a new folder for the subverse and generate
the `submission-index.json` file for the subverse:

	casperjs voatarc-1-build-index.js --subverse=subverse_name

This command will populate the subverse folder with detailed data files for
each submission in the subverse.

	casperjs voatarc-2-scrape-submissions.js --subverse=subverse_name


### Other

- ASCII Art found in source code is generated with 'Calvin S' font at
  [patorjk.com](http://patorjk.com/software/taag/#p=display&c=c%2B%2B&f=Calvin%20S&t=)

