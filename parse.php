<?php
header('Access-Control-Allow-Origin: http://fantasy.premierleague.com');

// anonymous tracking
// measurement protocol
$post = array(
	'v' => 1,
	'tid' => 'UA-42877953-1',
	'cid' => isset( $_REQUEST['cid'] ) ? $_REQUEST['cid'] : null,
	't' => 'pageview',
	'dh' => 'fplanalyzer.com',
	'dp' => '/parse.php',
	'dt' => 'Parser',
	'uip' => $_SERVER['REMOTE_ADDR'],
	'ua' => $_SERVER['HTTP_USER_AGENT'],
	'dr' => $_SERVER['HTTP_REFERER'],
);

$request = 'https://ssl.google-analytics.com/collect';
$request .= '?payload_data&';
$request .= http_build_query($post);
$result = file_get_contents( $request );

// parsing player data
// p = price
// n = number of owners
// c = NTI percent
// d = NTI today

$arr = array();
$predictor = isset( $_REQUEST['p'] ) ? $_REQUEST['p'] : 'CTC';
switch( $predictor ) {
	case 'TFPL':
		$url = 'http://totalfpl.com/pricechanges/';
		$content = file_get_contents($url);
		$start = strpos($content, 'var pricedata =')+16;
		$end = strpos($content, 'var eventdata =')-4;
		$str = substr($content, $start, $end-$start);
		$data = json_decode($str);

		// map creating code
		// $url = 'http://crackthecode.fiso.co.uk/blog/';
		// $content = file_get_contents($url);
		// $map = array();
		// foreach( $data as $k => $player ) {
		// 	$name = explode(',', $player->Nam);
		// 	$start = strpos( $content, trim( $name[1].' '.$name[0] ) );
		// 	if ( ! $start ) echo $player->Id.': '.$player->Nam.$player->Tem."\t".'NOT FOUND'.'<br />';
		// 	// $str = substr($content, $start-6, 6).'<br />';
		// 	// echo $k.': '.$player->Nam."\t".filter_var($str, FILTER_SANITIZE_NUMBER_INT).'<br />';
		// 	// $map[ $player->Id ] = filter_var($str, FILTER_SANITIZE_NUMBER_INT);
		// }
		// echo json_encode($map);
		// exit();

		// tfpl -> fpl
		$map = json_decode('{"880":"381","1405":"100","1196":"158","1276":"496","910":"217","1007":"34","34":"2","313":"12","1461":"","1172":"91","927":"152","1222":"342","1453":"","307":"539","344":"430","177":"431","480":"237","1480":"548","1337":"149","513":"53","1056":"364","487":"245","1194":"155","473":"81","1441":"356","619":"253","244":"368","208":"284","1027":"351","1097":"295","1418":"192","427":"216","373":"146","431":"30","136":"197","81":"236","267":"547","1402":"78","404":"460","1464":"525","1470":"532","402":"500","1324":"388","352":"14","1429":"254","429":"366","233":"231","736":"449","312":"448","341":"260","1237":"457","44":"288","495":"233","1224":"353","676":"207","1478":"545","1428":"","99":"29","1362":"172","1281":"298","1241":"472","1465":"526","864":"393","151":"378","1203":"164","104":"10","975":"349","483":"39","1475":"541","1398":"69","741":"452","1442":"362","97":"495","363":"489","1264":"279","1198":"159","135":"309","1293":"241","1390":"60","663":"84","1052":"343","1280":"385","1436":"","1389":"59","148":"99","451":"95","1437":"318","416":"41","460":"201","356":"392","396":"40","851":"289","367":"215","567":"400","1468":"530","289":"51","286":"292","113":"507","1216":"","1182":"114","803":"319","1408":"179","1247":"","114":"325","156":"484","1399":"71","1458":"514","1456":"506","932":"278","405":"67","419":"273","913":"49","337":"300","1416":"190","1035":"82","370":"200","1066":"456","1278":"121","1482":"550","1016":"307","1364":"125","1411":"182","187":"574","227":"","281":"580","529":"555","800":"560","826":"571","961":"577","1283":"558","1344":"561","1394":"64","1485":"556","1486":"557","1487":"559","1488":"562","1489":"563","1490":"564","1491":"565","1492":"566","1493":"567","1494":"568","1495":"569","1496":"570","1497":"572","1498":"573","1499":"575","1500":"576","1501":"578","1502":"579","1503":"581","1211":"228","1255":"120","1383":"390","720":"326","1483":"553","666":"487","682":"305","890":"88","937":"306","1170":"86","1303":"55","1404":"98","1230":"427","1239":"","1463":"524","1334":"38","1356":"445","1199":"160","1484":"554","1183":"115","1298":"109","1309":"123","737":"450","1268":"177","1417":"191","1240":"466","630":"102","909":"47","1388":"58","272":"118","1132":"93","1377":"469","1381":"97","219":"409","849":"379","1380":"150","1333":"222","867":"304","998":"338","1129":"413","1462":"523","335":"488","933":"276","1263":"27","1284":"436","1060":"142","1320":"355","1361":"475","1455":"485","1232":"","972":"188","1378":"438","507":"501","1094":"141","1207":"175","1084":"473","1286":"519","1041":"35","1313":"111","515":"113","664":"208","1185":"117","1375":"389","1110":"131","1445":"","1481":"549","1450":"459","915":"494","1138":"442","1452":"470","146":"169","1285":"19","1368":"","982":"414","1413":"184","559":"333","1262":"354","866":"373","1261":"346","1403":"83","580":"85","1384":"287","410":"74","617":"303","1316":"56","1372":"482","269":"271","991":"509","1104":"432","1315":"8","842":"206","1472":"537","1173":"92","1351":"140","1048":"359","417":"293","591":"48","36":"166","901":"76","1373":"415","1391":"61","1397":"68","1149":"37","639":"383","1114":"297","1432":"299","746":"251","990":"503","285":"327","860":"154","1297":"122","585":"136","627":"258","756":"479","243":"70","752":"128","400":"156","1151":"46","745":"461","433":"492","315":"490","372":"105","1251":"108","378":"324","1317":"361","1396":"66","1352":"316","995":"518","1071":"18","1374":"9","1012":"512","1326":"213","847":"535","1119":"7","1469":"531","1271":"240","1226":"402","75":"272","1358":"437","1435":"314","852":"42","1449":"458","444":"185","754":"446","1401":"75","271":"290","884":"238","32":"363","865":"375","629":"330","492":"50","1234":"","1250":"434","434":"407","747":"218","600":"406","1371":"481","328":"167","931":"516","406":"199","853":"468","777":"22","1067":"","1444":"396","84":"17","1328":"374","1473":"538","53":"551","711":"321","1013":"265","361":"133","804":"312","1227":"403","1275":"435","273":"11","490":"138","1421":"198","769":"480","439":"320","1244":"380","362":"163","1446":"412","1030":"224","212":"410","755":"428","751":"462","801":"5","1228":"404","1074":"505","1137":"220","1254":"","1393":"63","176":"32","1282":"360","142":"112","738":"451","1425":"232","1147":"33","1252":"255","195":"491","966":"340","1392":"62","1438":"","1187":"126","1379":"347","1325":"124","462":"397","445":"328","1479":"546","1258":"384","1433":"310","1206":"171","978":"357","132":"234","232":"72","338":"425","1412":"183","1002":"493","1302":"212","210":"441","1218":"264","1219":"280","275":"322","1148":"36","621":"31","73":"144","1448":"439","466":"513","179":"247","374":"420","375":"377","414":"552","1409":"180","413":"478","1457":"511","1474":"540","571":"274","475":"193","992":"517","844":"294","1447":"421","1184":"116","398":"504","1050":"44","1395":"65","1406":"153","377":"262","1000":"110","989":"502","1420":"196","453":"14","1440":"352","538":"170","1150":"45","1092":"315","1229":"426","1407":"178","42":"329","418":"477","80":"202","1017":"454","1049":"54","1451":"463","1376":"286","1235":"444","1287":"20","314":"520","1112":"296","40":"129","1400":"73","129":"243","1294":"372","1459":"515","981":"358","501":"476","1289":"","1415":"189","530":"411","970":"348","443":"332","1236":"453","1111":"311","1454":"474","31":"268","230":"367","1204":"165","1113":"308","1423":"209","1431":"283","394":"135","1260":"345","783":"447","1122":"139","1174":"104","246":"529","220":"483","109":"542","131":"148","1476":"543","1118":"391","1350":"96","1246":"497","778":"15","1466":"527","382":"270","1410":"181","1179":"107","898":"174","194":"399","934":"277","339":"186","1188":"127","806":"423","469":"422","1072":"339","120":"259","637":"486","240":"204","178":"331","1443":"376","1217":"263","161":"291","1434":"313","718":"334","228":"269","112":"227","733":"440","1424":"225","274":"395","1059":"239","1439":"337","1205":"168","582":"1","133":"230","918":"24","89":"194","186":"101","1477":"544","260":"13","1422":"","258":"162","197":"79","1427":"","218":"203","349":"370","474":"3","11":"57","403":"52","1300":"211","1419":"195","248":"398","1414":"187","35":"336","568":"302","21":"369","117":"499","1460":"521","464":"408","930":"210","974":"226","139":"151","320":"80","78":"137","1387":"28","1146":"26","986":"371","364":"508","1269":"335","478":"536","537":"418","1195":"157","782":"176","1288":"386","810":"103","1304":"417","977":"350","183":"510","91":"143","1176":"106","458":"424","550":"301","1215":"249","1267":"394","969":"341","252":"132","1171":"90","1245":"","1253":"256","415":"244","1385":"16","266":"282","588":"465","1031":"147","254":"419","1305":"21","1291":"387","1223":"344","235":"242","1471":"533","441":"285","680":"257","250":"134","138":"235","1004":"173","922":"43","1386":"23","298":"77","742":"534","482":"130","1200":"161","185":"416","838":"6","389":"214","1036":"455","470":"429","365":"4","1426":"","106":"365","265":"275","1225":"229","1209":"219","924":"89","1467":"528","1430":"281","638":"119","919":"25","1011":"401","1028":"266","809":"267","579":"145","1461":"522","1453":"471","1428":"252","1436":"317","1216":"250","1247":"498","227":"261","1232":"433","1445":"405","1368":"223","1254":"221","1438":"323","1289":"94","1422":"205","1245":"382","1426":"246"}', 1);
		$playerIds = explode(',', $_REQUEST['id']);
		foreach ( $data as $k => $v ) {
			if ( in_array($map[ $v->Id ], $playerIds) ) {
				$arr[ $map[ $v->Id ] ] = array(
					'p' => $v->Cos,
					'n' => $v->Sel,
					'd' => $v->NTI,
					'c' => $v->Col == "G" ? $v->Min : '-'.$v->Min,
				);
			}
		}
		break;
	case 'CTC':
	default:
		$url = 'http://crackthecode.fiso.co.uk/blog/';
		$content = file_get_contents($url);
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
		break;
}
echo json_encode( $arr );
exit();