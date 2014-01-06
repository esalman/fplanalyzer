// © Salman fplanalyzer.com
var fplAnalyzer = {
	initialized: false,
    // teams for 2013-14 season :)
	teamArr: {
		"Fulham":"FUL",
		"Arsenal":"ARS",
		"Everton":"EVE",
		"West Brom":"WBA",
		"Hull City":"HUL",
		"Norwich":"NOR",
		"Newcastle":"NEW",
		"West Ham":"WHM",
		"Southampton":"SOU",
		"Sunderland":"SUN",
		"Stoke City":"STK",
		"Crystal Palace":"CPA",
		"Aston Villa":"AVL",
		"Liverpool":"LIV",
		"Cardiff City":"CAR",
		"Man City":"MCY",
		"Tottenham":"TOT",
		"Swansea":"SWA",
		"Man Utd":"MUN",
		"Chelsea":"CHE"
	},
    // contains opponent of each team, updates each gw
    fixArr: {},
    // selected player price, nti
    playerAttrib: {},
    currentGW: 0,
    options: {
    	domain: 'http://pure-ocean-7640.herokuapp.com/',
        numberOfOpponentsToDisplay: 3
    },
    // ui elements
    controls: {
        loader: $('<span style="background: #F00; color: #FFF; position: fixed; top: 0px; left: 0px; padding: 3px 3px; display: none;">Loading...</span>'),
        pitchControls: {
            reload: $('<a class="reload" style="background: #126e37; color: #FFF; padding: 2px 3px; display: block; margin-bottom: 1px; font-size: smaller;" href="javascript:void(0)">Reload</a>'),
            prevGW: $('<a class="prevGW" style="background: #126e37; color: #FFF; padding: 2px 3px; display: block; margin-bottom: 1px; font-size: smaller;" href="javascript:void(0)">GW-1</a>'),
            nextGW: $('<a class="nextGW" style="background: #126e37; color: #FFF; padding: 2px 3px; display: block; margin-bottom: 1px; font-size: smaller;" href="javascript:void(0)">GW+1</a>'),
            opponent: $('<a class="opponent" style="background: #126e37; color: #FFF; padding: 2px 3px; display: block; margin-bottom: 1px; font-size: smaller;" href="javascript:void(0)">Opponent</a>'),
            price: $('<a class="price" style="background: #126e37; color: #FFF; padding: 2px 3px; display: block; margin-bottom: 1px; font-size: smaller;" href="javascript:void(0)">Price</a>'),
            ntit: $('<a class="ntit" style="background: #126e37; color: #FFF; padding: 2px 3px; display: block; margin-bottom: 1px; font-size: smaller;" href="javascript:void(0)">NTI day</a>'),
            nti: $('<a class="nti" style="background: #126e37; color: #FFF; padding: 2px 3px; display: block; margin-bottom: 1px; font-size: smaller;" href="javascript:void(0)">NTI%</a>'),
            genRMT: $('<a class="genRMT" style="background: #126e37; color: #FFF; padding: 2px 3px; display: block; margin-bottom: 1px; font-size: smaller;" href="javascript:void(0)">Gen RMT</a>')        
        }
    },
    // executed when bookmark clicked second time, and never again
    init: function () {
        // second time
    	fplAnalyzer.initialized = true
        // red loading block on top left of page
        $('body').append( fplAnalyzer.controls.loader )
        // create the overlay of pich area
        var parentDiv = $('<div id="fplAnalyzerControl" style="position: absolute; top: 0px; left: 0px; font-size: smaller;"></div>')
        // append ui controls above pitch area an dand bind their events
        $.each( fplAnalyzer.controls.pitchControls, function (i, v) {
            // show the price button on transfers page only
            parentDiv.append( v )
            v.bind( 'click', fplAnalyzer.events[i] )
        } )
        $('#ism .ismPitch').css('position', 'relative').append( parentDiv )

        // bind function to fixture change event
        $('#ism .ismFixtureContainer').bind( 'DOMNodeInserted', function (e) {
            fplAnalyzer.updateFixtureNavigateButton()
            fplAnalyzer.update()
        } )
    },
    // executed after bookmark clicked the first time, and also on reload button click
    update: function () {
    	fplAnalyzer.controls.loader.show()
    	fplAnalyzer.loadFisoData()
    },
    // parse the fixture table and update fixArr
    loadFixture: function () {
    	// fplAnalyzer.fixArr = {}
        if ( ! $('.ismFixtureTable caption').html() ) return
        fplAnalyzer.currentGW = $('.ismFixtureTable caption').html().split('-')[0].replace('Gameweek', '').trim()
	    $.each($(".ismFixtureTable tbody tr"), function (i, team) {
	    	fh = fplAnalyzer.fixArr[$(team).children(".ismHomeTeam").html()]
	    	fa = fplAnalyzer.fixArr[$(team).children(".ismAwayTeam").html()]
	    	th = fplAnalyzer.teamArr[$(team).children(".ismHomeTeam").html()]
	    	ta = fplAnalyzer.teamArr[$(team).children(".ismAwayTeam").html()]
            if ( ta == undefined ) return
            // if no fixture, empty
            // at home upper, at away lower
            // home on the left column
            if ( fplAnalyzer.fixArr[$(team).children(".ismHomeTeam").html()] == undefined ) fplAnalyzer.fixArr[$(team).children(".ismHomeTeam").html()] = {}
            fplAnalyzer.fixArr[$(team).children(".ismHomeTeam").html()][fplAnalyzer.currentGW] = ta.toUpperCase()
            // away on the right column
            if ( fplAnalyzer.fixArr[$(team).children(".ismAwayTeam").html()] == undefined ) fplAnalyzer.fixArr[$(team).children(".ismAwayTeam").html()] = {}
	        fplAnalyzer.fixArr[$(team).children(".ismAwayTeam").html()][fplAnalyzer.currentGW] = th.toLowerCase()
	    })
    },
    // update data of each player in pitch area
    updateOpponent: function () {
	    $.each($("#ismTeamDisplayGraphical div[id^=ismGraphical]"), function (i, player) {
            // this is for first time only
	    	$(player).find(".ismElementDetail dd").css('background-color', '#126E37')
            // find opponent using shirt title attribute
            var opponent = '<div class="opponent">'+ ( fplAnalyzer.getNextNOpponent( $(player).find(".ismShirt").attr("title") ) ) +'</div>'
            // get NTI Percent
            var nti = '<div class="nti" style="display: none;">'+ fplAnalyzer.playerAttrib[ fplAnalyzer.getPlayerIDFromContainer(player) ].NTIPercent +'%</div>'
            // get NTI Today
            var ntit = '<div class="ntit" style="display: none;">'+ fplAnalyzer.playerAttrib[ fplAnalyzer.getPlayerIDFromContainer(player) ].NTIToday +'</div>'
            // make price div
            var price = '<div class="price" style="display: none;">'+ fplAnalyzer.playerAttrib[ fplAnalyzer.getPlayerIDFromContainer(player) ].price +'</div>'
	    	$(player).find(".ismElementDetail dd").html( opponent + price + nti + ntit )
        })
        fplAnalyzer.controls.loader.hide()
    },
    // make an ajax call to heroku to scrape fiso data and return formatted nti data by player id
    loadFisoData: function () {
    	var ids = []
    	$.each( $('div[id^=ismGraphical]'), function (i, v) {
    		var id = fplAnalyzer.getPlayerIDFromContainer(v)
            // only request those players not saved yet
    		if ( fplAnalyzer.playerAttrib[ id ] == undefined ) {
                fplAnalyzer.playerAttrib[ id ] = {}
    			ids.push( id )
            }
    	} )

        // if nti of selected players are already available, new request will not be sent
    	if ( ids.length < 1 ) {
	    	fplAnalyzer.loadFixture()
    		fplAnalyzer.updateOpponent()
    		return
    	}

        // make request
    	$.getJSON( fplAnalyzer.options.domain+'fisoparse.php', {
    		id: ids.join(',')
    	} ).done( function ( json ) {
    		// populate the player attribute array
            $.each( json, function (i, v) {
                fplAnalyzer.playerAttrib[i].NTIPercent = v.c
                fplAnalyzer.playerAttrib[i].price = v.p
                fplAnalyzer.playerAttrib[i].NTIToday = v.d
            } )
            // update opponent
    		fplAnalyzer.loadFixture()
    		fplAnalyzer.updateOpponent()
    	} )
    },
    getPlayerIDFromContainer: function ( el ) {
        return $(el).find('a.ismViewProfile').attr('href').replace('#', '')
    },
    getPlayerPriceFromContainer: function ( el ) {
        return $(el).find('dd > span').html()
    },
    // events associated to ui elements
    events: {
        reload: function () {
            fplAnalyzer.update()
        },
        prevGW: function () {
            fplAnalyzer.controls.loader.show()
            $('.ismPagination a').first().click()
        },
        nextGW: function () {
            fplAnalyzer.controls.loader.show()
            $('.ismPagination a').last().click()
        },
        opponent: function () {
            $('.ismElementDetail dd > div').css('display', 'none')
            $('.ismElementDetail dd > div.opponent').css('display', 'block')
        },
        price: function () {
            $('.ismElementDetail dd > div').css('display', 'none')
            $('.ismElementDetail dd > div.price').css('display', 'block')
        },
        nti: function () {
            $('.ismElementDetail dd > div').css('display', 'none')
            $('.ismElementDetail dd > div.nti').css('display', 'block')
        },
        ntit: function () {
            $('.ismElementDetail dd > div').css('display', 'none')
            $('.ismElementDetail dd > div.ntit').css('display', 'block')
        },
        genRMT: function () {
            var rmtStr = '';
            $.each( $(".ismPitchRow"), function (j, row) {
                rmtStr += '\n'
                if ( j == 4 ) rmtStr += '\nSubs: '
                $.each( $(row).find('div[id^=ismGraphical]'), function (i, player) {
                    rmtStr += $(player).find('span.ismPitchWebName').html().trim()+' '
                })
            })
            window.prompt('You can copy the following RMT string:', rmtStr)
        }
    },
    updateFixtureNavigateButton: function () {
        if ( $('.ismPagPrev').length > 0 ) $('#fplAnalyzerControl .prevGW').html( $('.ismPagPrev').html().replace('Gameweek', 'GW') )
        if ( $('.ismPagNext').length > 0 ) $('#fplAnalyzerControl .nextGW').html( $('.ismPagNext').html().replace('Gameweek', 'GW') )
    },
    getNextNOpponent: function ( team ) {
        var opponentString = ''
        for ( i = 0; i < fplAnalyzer.options.numberOfOpponentsToDisplay; i++ ) {
            if ( fplAnalyzer.fixArr[ team ][ parseInt( fplAnalyzer.currentGW ) + i ] == undefined ) continue
            opponentString += fplAnalyzer.fixArr[ team ][ parseInt( fplAnalyzer.currentGW ) + i ] + ( i < fplAnalyzer.options.numberOfOpponentsToDisplay - 1 ? ' ' : '' )
        }
        return opponentString
    }
}

var fplAnalyzeTrigger = function () {
    if ( location.href.search('fantasy.premierleague.com') < 0 ) return
	if ( ! fplAnalyzer.initialized ) fplAnalyzer.init()
	fplAnalyzer.update()
}