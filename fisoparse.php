<?php
header('Access-Control-Allow-Origin: http://fantasy.premierleague.com');
include 'HTML5/Parser.php';
$url = 'http://crackthecode.fiso.co.uk/blog/';
$content = file_get_contents($url);
$arr = array();
foreach( explode(',', $_REQUEST['id']) as $playerId ) {
	$start = strpos( $content, 'fpl1314-player-history?id='.$playerId )-9;
	$str = substr($content, $start, 200);
	$end = strpos($str, '</tr>')-5;
	$str = substr($str, 0, $end);
	$info = explode('</td><td>', $str);
	$arr[ $playerId ] = $info[7];
}
echo json_encode( $arr );
exit();