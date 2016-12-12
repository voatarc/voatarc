
# voatarc

Project to gather posts and comments from a Voat subverse for archival purposes.

### Installation

This project uses [PhantomJS](http://phantomjs.org/)
and [CasperJS](http://casperjs.org/).

	npm install phantomjs --global
	npm install casperjs --global

### Usage

	casperjs voatarc.js subverse_name

Running this command will create a new folder for the subverse and populate it
with the posts and comments found in the specified subverse. If the subverse
folder already exists, it will be updated.

