<?php
header('Access-Control-Allow-Origin: http://fantasy.premierleague.com');

// anonymous tracking
require 'library/php-ga/autoload.php';
use UnitedPrototype\GoogleAnalytics;

$tracker = new GoogleAnalytics\Tracker('UA-42877953-1', 'fplanalyzer.com');

$visitor = new GoogleAnalytics\Visitor();
$visitor->setIpAddress($_SERVER['REMOTE_ADDR']);
$visitor->setUserAgent($_SERVER['HTTP_USER_AGENT']);
$visitor->setScreenResolution('1024x768');

$session = new GoogleAnalytics\Session();

$page = new GoogleAnalytics\Page('/fisoparse.php');
$page->setTitle('Parser');

$tracker->trackPageview($page, $session, $visitor);

// parsing player data
$url = 'http://crackthecode.fiso.co.uk/blog/';
$content = file_get_contents($url);
$arr = array();
foreach( explode(',', $_REQUEST['id']) as $playerId ) {
	$start = strpos( $content, 'fpl1415-player-history?id='.$playerId.'\'' )-9;
	$str = substr($content, $start, 200);
	$end = strpos($str, '</tr>')-5;
	$str = substr($str, 0, $end);
	$info = explode('</td><td>', $str);
	$arr[ $playerId ] = array(
		'p' => $info[3],
		'n' => str_replace(',', '', $info[4]),
		'd' => $info[5],
		'c' => $info[6],
	);
}
echo json_encode( $arr );
exit();
