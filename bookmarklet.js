javascript:(function (){
	if ( window.fplAnalyzeTrigger == undefined ) {
		var f = document.createElement('script')
		f.setAttribute("type", "text/javascript")
		f.setAttribute("src", "http://pure-ocean-7640.herokuapp.com/script.min.js")
		document.getElementsByTagName("head")[0].appendChild(f)
		$('body').append( $('<div style="background: #126E37; color: #FFF; position: fixed; top: 0px; width: 100%; text-align: center; padding: 3px 0px; font-weight: bold; font-size: larger;">FPLAnalyzer loaded! Click this again to analyze. Visit <a href="http://fplanalyzer.com" style="color: #EDEDED" target="_blank">fplanalyzer.com</a> for update <a href="#" onclick="javascript:$(this).parent().remove(); return false;" style="font-size: small; color: #EDEDED;">[close]</a></div>') )
	}
	else {
		window.fplAnalyzeTrigger()
	}
})()