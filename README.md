

# voatarc

Project to gather submissions and comments from a Voat subverse for archival purposes.

This system scrapes and archives the submissions/posts and submission comments
for a specific voat subverse.

Two scripts are used to generate the archive files for a single subverse.
You specify the subverse name and these scripts will scrape all of the 
submission and comment details for that subverse.
The scraped data is stored as a series of json files (one per submission)
within a folder for that subverse.

The source code for this project is hosted here: https://github.com/voatarc/voatarc

### 1. voatarc-1-build-index.js

Running this script will create a new folder for that specific subverse.
All scraped data files will be stored within this folder.
The first script builds an index for all of the submissions within a subverse
and stores that in a file: `submission-index.json`

#### Usage

	casperjs voatarc-1-build-index.js --subverse=subverse_name --max_pages=n
	
Usage Options:

- subverse : The name of the voat subverse to scrape (e.g. "news", "politics", etc.)
- max_pages : The maximum number of subverse index pages to scrape. The default and maximum is 20 pages.

#### Sample Output

	[
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
	]

### 2. voatarc-2-scrape-submissions.js

This script will load the `submission-index.json` file for the specified subverse.
It will then retrieve all of the submission detail and comments in the index.
Submission detail and submission comments are stored together in a single file.
The submission data files are named using the `submission_id` number and appending
a `.json` extension.
There will be one file per submission in the subverse.

#### Usage

	casperjs voatarc-2-scrape-submissions.js --subverse=subverse_name --snapshots

Usage Options:

- subverse : The name of the voat subverse to scrape (e.g. "news", "politics", etc.)
- snapshots : If this option is present, a snapshot of the scraped submission page will also be stored.
 
#### Sample Output

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
		]
	}


## Installation

This project uses [PhantomJS](http://phantomjs.org/)
and [CasperJS](http://casperjs.org/).

If you already have NPM, you can do the following.
Otherwise, consult the above links to view specific installation instructions
from each project's website.

	npm install phantomjs --global
	npm install casperjs --global

## Other Notes

- The submission index file (created by the first script) is limited to
containing submissions from only the first 20 pages of the subverse as
viewed on voat.co with default settings.
This is a limitation from voat.co as the website does not support viewing
beyond the first 20 pages of results.

- Not all submission comments are available.
Effort was made to ensure that the submission page was fully loaded by
continuously clicking the `Load More Replies` link as long as it was available.
There can still be hidden replies that lie behind links like `1 Reply` or `3 Replies`.

- ASCII Art found in source code is generated with 'Calvin S' font at
  [patorjk.com](http://patorjk.com/software/taag/#p=display&c=c%2B%2B&f=Calvin%20S&t=)

