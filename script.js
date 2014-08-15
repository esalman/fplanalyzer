// © 2013-2015 @ealman fplanalyzer.com
var fplAnalyzer = {
	initialized: false,
    // teams for 2014-15 season :D
	teamArr: {
		"Leicester":"LEI",
		"Arsenal":"ARS",
		"Everton":"EVE",
		"West Brom":"WBA",
		"Hull":"HUL",
		"QPR":"QPR",
		"Newcastle":"NEW",
		"West Ham":"WHM",
		"Southampton":"SOU",
		"Sunderland":"SUN",
		"Stoke":"STK",
		"Crystal Palace":"CPA",
		"Aston Villa":"AVL",
		"Liverpool":"LIV",
		"Burnley":"BUR",
		"Man City":"MCY",
		"Spurs":"TOT",
		"Swansea":"SWA",
		"Man Utd":"MUN",
		"Chelsea":"CHE"
	},
    // contains opponent of each team, updates each gw
    fixArr: {},
    // selected player price, nti
    playerAttrib: {},
    currentGW: 0,
    totalPlayer: null,
    options: {
    	domain: 'http://pure-ocean-7640.herokuapp.com/',
        numberOfOpponentsToDisplay: 1
    },
    // ui elements
    controls: {
        loader: $('<span style="background: #F00; color: #FFF; position: fixed; top: 0px; left: 0px; padding: 3px 3px; display: none;">Loading...</span>'),
        pitchControls: {
            reload: $('<a class="reload" style="background: #126e37; color: #FFF; padding: 2px 3px; display: inline-block; margin: 0px 1px 1px 0px; font-size: small; width: 14px; text-align: center;" href="javascript:void(0)" title="Reload">&#8634;</a>'),
            prevGW: $('<a class="prevGW" style="background: #126e37; color: #FFF; padding: 2px 3px; display: inline-block; margin: 0px 1px 1px 0px; font-size: small; width: 14px; text-align: center;" href="javascript:void(0)" title="Previous GW">◀</a>'),
            nextGW: $('<a class="nextGW" style="background: #126e37; color: #FFF; padding: 2px 3px; display: inline-block; margin: 0px 1px 1px 0px; font-size: small; width: 14px; text-align: center;" href="javascript:void(0)" title="Next GW">▶</a><br />'),
            opponent: $('<a class="opponent" style="background: #35A649; color: #FFF; padding: 2px 3px; display: inline-block; margin: 0px 1px 1px 0px; font-size: small; width: 14px; text-align: center;" href="javascript:void(0)" title="Opponent">V</a>'),
            price: $('<a class="price" style="background: #35A649; color: #FFF; padding: 2px 3px; display: inline-block; margin: 0px 1px 1px 0px; font-size: small; width: 14px; text-align: center;" href="javascript:void(0)" title="Price">£</a>'),
            own: $('<a class="own" style="background: #35A649; color: #FFF; padding: 2px 3px; display: inline-block; margin: 0px 1px 1px 0px; font-size: small; width: 14px; text-align: center;" href="javascript:void(0)" title="% Ownership">%</a><br />'),
            ntit: $('<a class="ntit" style="background: #126e37; color: #FFF; padding: 2px 3px; display: inline-block; margin: 0px 1px 1px 0px; font-size: small; width: 14px; text-align: center;" href="javascript:void(0)" title="NTI Today">T</a>'),
            nti: $('<a class="nti" style="background: #126e37; color: #FFF; padding: 2px 3px; display: inline-block; margin: 0px 1px 1px 0px; font-size: small; width: 14px; text-align: center;" href="javascript:void(0)" title="% NTI">%</a>'),
            genRMT: $('<a class="genRMT" style="background: #126e37; color: #FFF; padding: 2px 3px; display: inline-block; margin: 0px 1px 1px 0px; font-size: small; width: 14px; text-align: center;" href="javascript:void(0)" title="Rate My Team!">★</a><br />'),
            webLink: $('<a class="webLink" style="background: #35A649; color: #FFF; padding: 2px 3px; display: inline-block; margin: 0px 1px 1px 0px; font-size: small; width: 14px; text-align: center;" href="http://fplanalyzer.com" target="_blank" title="www.fplanalyzer.com">&copy;</a>'),
            share: $('<a class="share" style="background: #35A649; color: #FFF; padding: 2px 3px; display: inline-block; margin: 0px 1px 1px 0px; font-size: small; width: 14px; text-align: center;" href="javascript:void(0)" title="Share FPL Analyzer!">❤</a><div class="addthis_sharing_toolbox" style="display: none;" data-url="http://fplanalyzer.com" data-title="Check out FPL Analyzer!"></div>')
        }
    },
    // executed when bookmark clicked second time, and never again
    init: function () {
        // second time
    	fplAnalyzer.initialized = true
        // red loading block on top left of page
        $('body').append( fplAnalyzer.controls.loader )
        // create the overlay of pich area
        var parentDiv = $('<div id="fplAnalyzerControl" style="position: absolute; top: -42px; left: 0px; font-size: smaller;"></div>')
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
        // set total player
        if ( $('.ismDefList.ismRHSDefList').length > 0 ) {
            fplAnalyzer.totalPlayer = parseInt( $( $('.ismDefList.ismRHSDefList').children('dd')[2] ).text().replace(/,/g, '') )
            createCookie('fplAnalyzerTotalPlayer', fplAnalyzer.totalPlayer, 7)
        }
        if ( readCookie('fplAnalyzerTotalPlayer') && fplAnalyzer.totalPlayer != readCookie('fplAnalyzerTotalPlayer') ) fplAnalyzer.totalPlayer = readCookie('fplAnalyzerTotalPlayer')

        // addthis share buttons
        var f = document.createElement('script')
        f.setAttribute("type", "text/javascript")
        f.setAttribute("src", "//s7.addthis.com/js/300/addthis_widget.js#pubid=ra-53edcfcd20914b86")
        document.getElementsByTagName("head")[0].appendChild(f)
    },
    // executed after bookmark clicked the first time, and also on reload button click
    update: function () {
    	fplAnalyzer.controls.loader.show()
    	fplAnalyzer.loadFisoData()
    },
    // parse the fixture table and update fixArr
    loadFixture: function () {
    	fplAnalyzer.fixArr = {}
        if ( ! $('.ismFixtureTable caption').html() ) return
        fplAnalyzer.currentGW = $('.ismFixtureTable caption').html().split('-')[0].replace('Gameweek', '').trim()
	    $.each($(".ismFixtureTable tbody tr"), function (i, team) {
            h = $(team).children(".ismHomeTeam").html()
	    	a = $(team).children(".ismAwayTeam").html()
            if ( fplAnalyzer.teamArr[h] == undefined ) return
            // if no fixture, empty
            // at home uppercase, at away lowercase
            // home on the left column
            if ( fplAnalyzer.fixArr[h] == undefined ) {
                fplAnalyzer.fixArr[h] = {}
                fplAnalyzer.fixArr[h][fplAnalyzer.currentGW] = fplAnalyzer.teamArr[a].toUpperCase()
            }
            else fplAnalyzer.fixArr[h][fplAnalyzer.currentGW] += ' '+ fplAnalyzer.teamArr[a].toUpperCase()
            // away on the right column
            if ( fplAnalyzer.fixArr[a] == undefined ) {
                fplAnalyzer.fixArr[a] = {}
                fplAnalyzer.fixArr[a][fplAnalyzer.currentGW] = fplAnalyzer.teamArr[h].toLowerCase()
           }
           else fplAnalyzer.fixArr[a][fplAnalyzer.currentGW] += ' '+ fplAnalyzer.teamArr[h].toLowerCase()
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
            // make %ownership div
            var ownership = '<div class="ownership" style="display: none;">'+ fplAnalyzer.playerAttrib[ fplAnalyzer.getPlayerIDFromContainer(player) ].ownership +'</div>'
	    	$(player).find(".ismElementDetail dd").html( opponent + price + nti + ntit + ownership )
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
                fplAnalyzer.playerAttrib[i].ownership = fplAnalyzer.totalPlayer ? ( v.n * 100 / fplAnalyzer.totalPlayer ).toFixed(2) + '%' : v.n
            } )
            // update opponent
    		fplAnalyzer.loadFixture()
    		fplAnalyzer.updateOpponent()
    	} )
        fplAnalyzer.loadFixture()
        fplAnalyzer.updateOpponent()
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
        own: function () {
            $('.ismElementDetail dd > div').css('display', 'none')
            $('.ismElementDetail dd > div.ownership').css('display', 'block')
        },
        share: function () {
            if ( $('.addthis_sharing_toolbox').css('display') === 'none' ) $('.addthis_sharing_toolbox').show()
            else $('.addthis_sharing_toolbox').hide()
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
        if ( $('.ismPagPrev').length > 0 ) $('#fplAnalyzerControl .prevGW').html( $('.ismPagPrev').html().replace('Gameweek ', '') )
        if ( $('.ismPagNext').length > 0 ) $('#fplAnalyzerControl .nextGW').html( $('.ismPagNext').html().replace('Gameweek ', '') )
    },
    getNextNOpponent: function ( team ) {
        var opponentString = ''
        for ( i = 0; i < fplAnalyzer.options.numberOfOpponentsToDisplay; i++ ) {
            if ( fplAnalyzer.fixArr[ team ] == undefined || fplAnalyzer.fixArr[ team ][ parseInt( fplAnalyzer.currentGW ) + i ] == undefined ) continue
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

var createCookie = function (name,value,days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
        var expires = "; expires="+date.toGMTString();
    }
    else var expires = "";
    document.cookie = name+"="+value+expires+"; path=/";
}

var readCookie = function (name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

var eraseCookie = function (name) {
    createCookie(name,"",-1);
}
