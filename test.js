const {createSignal} = require("./api");
const {handleInputChange, funcAllCreate} = require("./utils");

const data = [{"_":"message","flags":8406656,"out":false,"mentioned":false,"media_unread":false,"silent":false,"post":true,"from_scheduled":false,"legacy":false,"edit_hide":false,"pinned":false,"noforwards":false,"id":2829,"peer_id":{"_":"peerChannel","channel_id":"1521683754"},"date":1654604699,"message":"#покупка \nLong. Futures. BnB\n\nВход 276$\nЦель 282\nСтоп: 273,5\n\nРиск высокий!","media":{"_":"messageMediaPhoto","flags":1,"photo":{"_":"photo","flags":0,"has_stickers":false,"id":"5258041127636942220","access_hash":"18015072779587177422","file_reference":{"0":2,"1":90,"2":179,"3":13,"4":42,"5":0,"6":0,"7":11,"8":13,"9":98,"10":159,"11":67,"12":155,"13":124,"14":214,"15":133,"16":132,"17":198,"18":167,"19":239,"20":206,"21":44,"22":17,"23":18,"24":236,"25":35,"26":207,"27":45,"28":216},"date":1654604699,"sizes":[{"_":"photoStrippedSize","type":"i","bytes":{"0":1,"1":23,"2":40,"3":130,"4":67,"5":229,"6":150,"7":227,"8":56,"9":168,"10":131,"11":238,"12":111,"13":187,"14":140,"15":117,"16":171,"17":70,"18":63,"19":52,"20":21,"21":7,"22":39,"23":60,"24":129,"25":85,"26":229,"27":133,"28":162,"29":121,"30":20,"31":157,"32":167,"33":110,"34":71,"35":56,"36":231,"37":35,"38":250,"39":102,"40":177,"41":77,"42":51,"43":86,"44":73,"45":229,"46":130,"47":51,"48":142,"49":105,"50":161,"51":114,"52":188,"53":83,"54":139,"55":196,"56":11,"57":12,"58":19,"59":144,"60":64,"61":198,"62":79,"63":175,"64":255,"65":0,"66":90,"67":129,"68":147,"69":35,"70":96,"71":29,"72":167,"73":129,"74":133,"75":169,"76":29,"77":200,"78":217,"79":156,"80":5,"81":81,"82":192,"83":108,"84":209,"85":86,"86":98,"87":131,"88":237,"89":0,"90":20,"91":237,"92":215,"93":218,"94":138,"95":174,"96":97,"97":50,"98":108,"99":236,"100":141,"101":246,"102":99,"103":121,"104":28,"105":26,"106":172,"107":254,"108":105,"109":13,"110":242,"111":246,"112":24,"113":57,"114":246,"115":35,"116":250,"117":209,"118":69,"119":54,"120":144,"121":211,"122":19,"123":205,"124":32,"125":150,"126":35,"127":185,"128":199,"129":63,"130":79,"131":240,"132":166,"133":153,"134":60,"135":198,"136":70,"137":218,"138":48,"139":131,"140":29,"141":122,"142":254,"143":148,"144":81,"145":73,"146":69,"147":8,"148":154,"149":59,"150":131,"151":21,"152":184,"153":69,"154":56,"155":235,"156":210,"157":138,"158":40,"159":170,"160":73,"161":16,"162":217}},{"_":"photoSize","type":"m","w":320,"h":180,"size":26263},{"_":"photoSize","type":"x","w":800,"h":450,"size":106084},{"_":"photoSizeProgressive","type":"y","w":1280,"h":720,"sizes":[14085,36961,57104,84398,139698]}],"dc_id":2}},"entities":[{"_":"messageEntityHashtag","offset":0,"length":8}],"views":1,"forwards":0,"replies":{"_":"messageReplies","flags":1,"comments":true,"replies":0,"replies_pts":0,"channel_id":"1504464670"}}]


//funcAllCreate(data)