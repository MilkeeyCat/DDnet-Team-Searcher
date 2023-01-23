# DDnet team searcher

I'm making this thing because it's one of the hardest problems in the game. You simply cant find anybody to play with. And on this website(if i finish it) you will be able to find homies.

I'd like to add some image or gif here but Im lazy fuck 🙂

## Installation

To make this website work you need 2 more things.

- Rust script which you can find [here](https://github.com/MilkeeyCat/ddnet_handler_server)
- Modified ddnet server [link](https://github.com/MilkeeyCat/ddnet/tree/milkey)
    
    Read how to compile ddnet server but yourself, I cant explain because I dont know myself :\
    Dont forget to put that rust build thingy in directory where's your DDnet-Server file.

Also before going any further go and setup .env values in backend folder.

## Usage

After installing source code from github, install all required dependencies for website ( after running this command you can go to drink some coffee )
```properties 
npm install
```

### ***One century later***

After that run this

```properties
npm run backend build

npm run backend setup-db
```

Did you think that's the end? Fuck no. Now you have to setup game servers. Like...
There's table in database called `servers` and... Just run code: 
```bash
# ip it's the ip of server where your maps will be running, by default it's 192.168.56.1 (or it's just me idk)]
# port is a port where game server runs xD
# file is... a config file of server ( pls add it or nothing will work :\ ) (without .cfg)
INSERT INTO servers (ip, port, file) VALUES('192.168.0.1', 8505, 'your-servers-file');
```

Aaaaaand now finally can run the website :D

```properties
npm run backend dev # run this command to run backend

npm run frontend dev # run this command to run frontend respectively
```

If it doesnt work it means... Im fucking idiot and there're bugs.... Maybe if you show me an error I will help to fix it( or just dont even try to install it )