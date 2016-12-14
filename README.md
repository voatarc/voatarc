
# voatarc

Project to gather submissions and comments from a Voat subverse for archival purposes.

### Installation

This project uses [PhantomJS](http://phantomjs.org/)
and [CasperJS](http://casperjs.org/).

	npm install phantomjs --global
	npm install casperjs --global

### Usage

	casperjs voatarc.js --subverse=subverse_name

Running this command will create a new folder for the subverse and populate it
with the submissions and comments found in the specified subverse. If the subverse
folder already exists, it will be updated.

### Other

- ASCII Art found in source code is generated with 'Calvin S' font at
  [patorjk.com](http://patorjk.com/software/taag/#p=display&c=c%2B%2B&f=Calvin%20S&t=)

