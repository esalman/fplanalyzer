var fplAnalyzer = {
	initialized: false,
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
    fixArr: {},
    fisoArr: {},
    options: {
    	domain: 'http://127.0.0.1/test/fpl/'
    },
    init: function () {
    	fplAnalyzer.initialized = true
    	$('body').append( fplAnalyzer.loader )
    },
    update: function () {
    	fplAnalyzer.loader.show()
    	fplAnalyzer.loadFisoData()
    },
    loadFixture: function () {
    	fplAnalyzer.fixArr = {}
	    $.each($(".ismFixtureTable tbody tr"), function (i, team) {
	    	fh = fplAnalyzer.fixArr[$(team).children(".ismHomeTeam").html()]
	    	fa = fplAnalyzer.fixArr[$(team).children(".ismAwayTeam").html()]
	    	th = fplAnalyzer.teamArr[$(team).children(".ismHomeTeam").html()]
	    	ta = fplAnalyzer.teamArr[$(team).children(".ismAwayTeam").html()]
	        fplAnalyzer.fixArr[$(team).children(".ismHomeTeam").html()] = (fh == undefined ? "" : fh + ",") + ta.toUpperCase()
	        fplAnalyzer.fixArr[$(team).children(".ismAwayTeam").html()] = (fa == undefined ? "" : fa + ",") + th.toLowerCase()
	    })
    },
    updateOpponent: function () {
	    $.each($("#ismTeamDisplayGraphical div[id^=ismGraphical]"), function (i, player) {
	    	$(player).find(".ismElementDetail dd").css('background-color', '#126E37')
	    	var fisoTarget = fplAnalyzer.fisoArr[ fplAnalyzer.parseismGraphicalClass(player) ]
	    	var str = fplAnalyzer.fixArr[$(player).find(".ismShirt").attr("title")] == undefined ? "" : fplAnalyzer.fixArr[$(player).find(".ismShirt").attr("title")]
	    	str += ' <span style="color: #CCC">' + fisoTarget + '%</span>'
	    	$(player).find(".ismElementDetail dd").html( str )
        })
        fplAnalyzer.loader.hide()
    },
    loadFisoData: function () {
    	var ids = []
    	$.each( $('div[id^=ismGraphical]'), function (i, v) {
    		var id = fplAnalyzer.parseismGraphicalClass(v)
    		if ( fplAnalyzer.fisoArr[ id ] == undefined )
    			ids.push( id )
    	} )

    	if ( ids.length < 1 ) {
	    	fplAnalyzer.loadFixture()
    		fplAnalyzer.updateOpponent()
    		return;
    	}

    	$.getJSON( fplAnalyzer.options.domain+'fisoparse.php', {
    		id: ids.join(',')
    	} ).done( function ( json ) {
    		$.extend( fplAnalyzer.fisoArr, json )
    		fplAnalyzer.loadFixture()
    		fplAnalyzer.updateOpponent()
    	} )
    },
    parseismGraphicalClass: function ( el ) {
    	return $(el).find('a.ismViewProfile').attr('href').replace('#', '')
    },
    loader: $('<span style="background: #F00; color: #FFF; position: fixed; top: 0px; left: 0px; padding: 3px 3px; display: none;">Loading...</span>')
}
var fplAnalyzeTrigger = function () {
	if ( ! fplAnalyzer.initialized ) fplAnalyzer.init()
	fplAnalyzer.update()
}