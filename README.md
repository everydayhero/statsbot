A slackbot bot for reporting stats to a slack channel (from librato)

## Usage

Responds to commands such as
```
@librato start polling [metric name] every 5 minutes
```

## Commands

Each of the following commands are followed by a metric name (and an optional polling interval)

- start polling...
- poll...
- tell me...
- what's...

## Running locally

You will need you SLACK_TOKEN, LIBRATO_USER, and LIBRATO_TOKEN in your environment, then simply run
```
npm install && npm start
```
