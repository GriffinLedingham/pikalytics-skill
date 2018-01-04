'use strict';
var Alexa = require("alexa-sdk");
var request = require('sync-request');

exports.handler = function(event, context) {
    var alexa = Alexa.handler(event, context);
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {
    'LaunchRequest': function () {
        this.response.speak('Ask me for a Pokemon\'s data')
        this.emit(':responseReady')
    },
    'AMAZON.StopIntent' : function() {
        this.response.speak('Bye');
        this.emit(':responseReady');
    },
    'AMAZON.HelpIntent' : function() {
        this.response.speak("You can try: 'alexa, ask pokemon info for Venusaur moves'");
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent' : function() {
        this.response.speak('Bye');
        this.emit(':responseReady');
    },
    'Unhandled' : function() {
        this.response.speak("Sorry, I didn't get that. You can try: 'alexa, ask pokemon info for Venusaur moves'");
    },
    'PokemonIntent': function() {
        this.emit('PokemonResponse')
    },
    'PokemonResponse': function() {
        var name = this.event.request.intent.slots.pokemon_name.value;
        var type = this.event.request.intent.slots.type.value;
          try {
            var res = request('GET','http://pikalytics.com/api/p/2017-10/vgc2018-1760/'+name)
            var data = JSON.parse(res.getBody('utf8'));
            switch(type) {
              case "move":
                this.response.speak('Top moves for ' + name + ' are ' + data.moves[0].move + ', ' + data.moves[1].move + ', and ' + data.moves[2].move)
                  .cardRenderer('Find ' + name +' Moves', 'Top moves for ' + name + ' are ' + data.moves[0].move + ', ' + data.moves[1].move + ', and ' + data.moves[2].move);
              break;
              case "teammate"
                this.response.speak('Top team mates for ' + name + ' are ' + data.team[0].pokemon + ', ' + data.team[1].pokemon + ', and ' + data.team[2].pokemon)
                  .cardRenderer('Find ' + name +' Team Mates', 'Top team mates for ' + name + ' are '  + data.team[0].pokemon + ', ' + data.team[1].pokemon + ', and ' + data.team[2].pokemon);
              break;
            }
          } catch(e) {
            this.response.speak('No data found, try another Pokemon')
                         .cardRenderer('Find ' + name +' Moves', 'No data found, try another Pokemon');
          }
        this.emit(':responseReady')


    }
};
