javascript:(function (){
	if ( window.fplAnalyzeTrigger == undefined ) {
		var f = document.createElement('script')
		f.setAttribute("type", "text/javascript")
		f.setAttribute("src", "http://pure-ocean-7640.herokuapp.com/script.min.js")
		document.getElementsByTagName("head")[0].appendChild(f)
	}
	else {
		window.fplAnalyzeTrigger()
	}
})()
