+++
Author = "Dan Bahrami"
Description = "A test driven tutorial for React and Redux in which we'll build a game of classic windows minesweeper."
Resources = []
date = "2016-03-14T18:13:37Z"
draft = true
publishdate = ""
slug = "a-game-of-minesweeper-in-react-and-redux"
title = "A game of minesweeper in React and Redux"

+++

```
git clone https://github.com/gaearon/react-hot-boilerplate.git ReactMinesweeper

cd ReactMinesweeper
```

```
npm install
```

```
npm install --save redux react-redux
```

```
mkdir tests
npm install --save-dev tape
```

update babel-loader test in webpack.config.dev...

```
module: {
    loaders: [{
      test: /\.jsx?$/,
      loaders: ['react-hot', 'babel'],
      include: path.join(__dirname, 'src')
    }]
  }
```

<!--more-->