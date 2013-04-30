shepherd
========

> GitHub Post-Hook server with project deployment

## Instructions

```
$ git clone https://github.com/musthash/shepherd.git
$ cd shepherd
$ npm install
```

Edit the `config.json` file to match your preferences.

```
$ npm start
```

## Options

```
{
    "log": "../logs/shepherd.log",
    "repository": "musthash/fuckyourcode.com",
    "branch": "master",
    "repository-folder": "../public",
    "port": 3001,
    "post-script": ""
}
```

 * _log_ : where the log file will be written
 * _repository_ : which repository should the server pay attention
 * _branch_ : which branch should the server pay attention
 * _repository-folder_ : where should shepherd issue the git pull command
 * _port_ : which port should the server listen to
 * _post-script_ : a given script that will be required when the pull is successful

## Step-by-step instructions

The directories chosen are mainly examples, adapt to your needs.

### Clone your repository on you server and checkout the correct branch

```
cd /var/www/fuckyourcode.com
```
```
git clone https://github.com/MustHash/fuckyourcode.com.git .
```
```
git checkout deploy-branch
```

### Set up the shepherd server

```
cd /var/www/private/shepherd
```
```
npm start
```

Notice that in the `config.json` file the repository folder should match the `/var/www/fuckyourcode.com`
