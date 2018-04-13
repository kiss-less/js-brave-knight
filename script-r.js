//Declaring variables
//Character starting conditions
var lvl = 1;
var exp = 0;
var hp = 50;
var dmg = 5;
var def = 0;
var money = 20;
var speed = 3;
//Environment vars, events and items
var actualTreasure = 0;
var monster =[];
//Traps array - the problem, successful ending, failure ending
var traps = [
["Огромный медведь быстро бежал в твою сторону. <br>","Тебе повезло и ты успел спрятаться от него в кустах.","Он подбежал настолько быстро, что ты не успел ничего сделать.<br>"],
["Ты не заметил огромную яму прямо перед тобой...<br>"," Когда ты уже было начал падать в неё,<br>ты успел в последний момент зацепиться за корни дерева."," Ты упал в неё. Яма оказалась очень глубокой.<br>"],
["Огромная стая пчёл летела в твоём направлении.<br>","Ты быстро лёг на землю и Укрылся листьями. Пчёлы пролетели мимо.","Ты начал бежать в противоположную сторону, но врезался в дерево.<br>"],
["Группа волков окружила тебя.<br>","Ты вспомнил о гниющем куске мяса в рюкзаке.<br> Достал его, кинул волкам и аккуратно удалился.","Ты хотел отвлечь их едой, но под рукой ничего не оказалось. Волки напали на тебя.<br>"],
["Ты нашёл бутылку со странной жидкостью на земле.<br>","Ты вылил на землю немного жидкости, прежде чем попробовать её на вкус.<br> Это оказалось верным решением: Землю покрыло пламя.","Ты очень сильно хотел пить и не задумываясь отхлебнул из неё.<br>Жидкость обожгла тебе рот и горло.<br>"],
["Огромный паук спустился с ветки дерева.<br>","Ты аккуратно лёг на землю. Паук прошёл мимо.","Ты начал медленно опускаться на землю, но паук заметил тебя и атаковал.<br>"],
["Ты услышал женский голос, просящий помощи из ближайшего озера.<br>","Ты прыгнул в воду и спас девушку.","Ты прыгнул в воду, но девушки там не оказалось.<br> Только Химера, которая напала на тебя."],
["Начался шторм и ты заметил избушку неподалёку.<br>","Ты бросился к ней, дверь открыла милая дама и пригласила тебя в дом,<br>чтобы переждать бурю.","Но ты не был достаточно быстр, чтобы успеть добежать до дома,<br>прежде чем буря настигла тебя.<br>"]
];
//Shop items array - the name, bonus value, price, stat to improve, description
shopItems = [
["Малое зелье лечения", 10, 10, "hp", "Восстанавливает немного здоровья"],
["Среднее зелье лечения", 15, 15, "hp", "Восстанавливает среднее количество здоровья"],
["Большое зелье лечения", 30, 30, "hp", "Восстанавливает много здоровья"],
["Небольшая книга", 10, 5, "exp", "Даёт немного опыта"],
["Средняя книга", 20, 10, "exp", "Даёт среднее количество опыта"],
["Огромная книга", 40, 20, "exp", "Даёт много опыта"],
["Кожаная броня", 3, 10, "def", "Добавляет немного защиты"],		
["Деревянная броня", 5, 20, "def", "Добавляет немного защиты"],	
["Железная броня", 7, 40, "def", "Добавляет среднее количество защиты"],	
["Стальная броня", 10, 60, "def", "Добавляет много защиты"],			
["Маленький топор", 3, 10, "dmg", "Добавляет немного урона"],	
["Средний топор", 5, 20, "dmg", "Добавляет среднее количество урона"],
["Большой топор", 7, 30, "dmg", "Добавляет много урона"]					
];
var currentItem = [];
var princess = false;
//events object. Event:amount. Events sum should be equal to amounts of bricks - 1. (SPOILER) The last brick is a princess ;)
var events = {Empty:6, Monster:10, Shop:4, Treasure:4, Trap:5, Exp:5}
var canvas = document.getElementById("field");
var ctx = canvas.getContext("2d");
var heroRadius = 10;
var heroColor = "#000000";
var x = canvas.width/2;
var y = canvas.height-15;
var tmpX = 0;
var tmpY = 0;
var brickColor = "#228B22";
var brickRowCount = 5;
var brickColumnCount = 7;
var bricksLeft = brickRowCount*brickColumnCount;
var brickWidth = 20;
var brickHeight = 20;
var brickPadding = 35;
var brickOffsetTop = 30;
var brickOffsetLeft = 65;
//Controls setup
var rightPressed = false;
var leftPressed = false;
var upPressed = false;
var downPressed = false;
document.addEventListener("keydown",keyDownHandler,false);
document.addEventListener("keyup",keyUpHandler,false);

//Functions
//Bricks array
var bricks = [];
for(c=0; c<brickColumnCount; c++) {
    bricks[c] = [];
    for(r=0; r<brickRowCount; r++) {
         bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}


function keyDownHandler(e){	
	if(e.keyCode==39){		
		rightPressed=true;
	}	else if(e.keyCode==38){		
		upPressed=true;		
	}	else if(e.keyCode==40){		
		downPressed=true;		
	}	else if(e.keyCode==37){		
		leftPressed=true;		
		}
	}
	
function keyUpHandler(e){	
	if(e.keyCode==39){		
		rightPressed=false;
	}	else if(e.keyCode==38){		
		upPressed=false;		
	}	else if(e.keyCode==40){		
		downPressed=false;		
	}	else if(e.keyCode==37){		
		leftPressed=false;		
		}
	}
	
Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};
//Event Choosing function if the last brick - there is a princess
function chooseEvent(){
	var eventId = "";
	var eventName = "";
	if (princess == true) {
		eventId = "6";
		writeConsole("Princess");
		gameOver("Игра закончена! Ты нашёл принцессу!");
	} else {
	var rnd = Math.floor(Math.random() * Object.size(events));
	if (events[Object.keys(events)[rnd]] > 0){
		eventId = rnd;
		eventName = Object.keys(events)[rnd];
		events[Object.keys(events)[rnd]] -= 1;
		writeConsole(eventName);
		//console.log(eventId);
		//console.log(events);
	} else {
		chooseEvent();
	}
	generateEvent(eventName);
	//comment the below line after all events will be created, uncomment it for testing purposes
	//showHero();
	}
	}
//Creates Continue button with showing a hero or not, depends on argument passed
function continueButton(fin){
	if (fin == true){
		return "<br><br><button onclick='showHero();clearConsole();'>Продолжить</button>";
	} else {
		return "<br><br><button onclick='clearConsole();'>Продолжить</button>";
	}
}
// Event generating functions
function generateEvent(name){
	switch (name) {
		case "Empty":
			var emptyMsg = [
			"Ты что-то услышал и уже приготовился к бою.<br>Но это был всего-лишь ветер, сдувающий листья с дерева рядом с тобой...", 
			"Голоса в твоей голове запутали тебя. Ты осторожно оглянулся.<br>Но в этот раз вокруг не было ни души...",
			"Бггггггггдррррым..дыщ..пыщ.. - услышал ты из-за кустов.<br> Ты осторожно отодвинул кусты оружием,<br> но это был всего-лишь кролик, жующий траву.",
			"Что за ужасный запах? Ты подошёл поближе в яме, чтобы проверить.<br>Уф, это лишь чей-то труп. Вероятно, бедняга не заметил ловушку.",
			"ЗОМБИ! Ты уж было начал размахивать оружием, как вдруг понял,<br>Что это лишь твои галлюцинации. Хмм,<br>не стоило тебе есть те грибы...",
			"Ты увидел на земле свежий след крови и пошёл по нему. Но внезапно <br> след исчез посреди дороги. Странно...",
			"Ты пробирался через кусты, как вдруг услышал тихие шаги сзади. <br>Ты обернулся, готовый к бою, но увидел<br>лишь лису, идущую за тобой.",
			"Здесь ничего нет. Будем считать это хорошей новостью.",
			"Ты заметил на земле несколько теней. Тихонько ты подошёл ближе,<br> чтобы разглядеть незнакомцев.<br>Но это оказались лишь колышущиеся на ветру деревья.",
			"Ты почувствовал чьё-то присутствие. Когда ты проверил за ближайшим деревом,<br>несколько белок разбежалось по сторонам.",
			"Ты почуял что-то необычное, но когда подошёл ближе,<br>обнаружил, что это лишь непотушенный костёр."
			];
			var emptyRnd = Math.floor(Math.random() * emptyMsg.length);
			writeConsole(emptyMsg[emptyRnd]+continueButton(true));
			break;
		case "Monster":
			var monsterNames = ["Зомби", "Оборотень", "Буйвол", "Призрак", "Медведь", "Вор в законе", "Циклоп", "Химера", "Сфинкс", "Вампир", "Волк", "Тёмный рыцарь", "Гуль", "Гном", "Волшебник", "Нинздя", "В.В.Путин", "Тролль"];
			var monsterName = monsterNames[Math.floor(Math.random() * monsterNames.length)];
			var monsterLvl = Math.floor(Math.random() * 6) + 1;
			var monsterDmg = monsterLvl * 3;
			var monsterHp = monsterLvl * 5 + 25;
			monster = [monsterName, monsterLvl, monsterDmg, monsterHp];
			var monsterStats = monster[0]+" уровень "+monster[1]+". Урон: "+monster[2]+", HP: "+monster[3];
			var monsterMsg = [
			"Ого! Какой-то монстр вылез из кустов на тебя! Это ",
			"Кто-то тронул тебя за плечо. Это оказался ",
			"Что-то упало прямо перед тобой. Обожемой, да это же ",
			"Ты услышал гулкий рёв за спиной. Повернувшись, ты увидел, как на тебя идёт ",
			"Камень пролетел рядом с твоей головой. Ты посмотрел, кто его кинул. Это оказался ",
			"Кто-то прыгнул прямо на тебя. К счастью, тебе удалось увернуться. Это оказался ",
			"Ты что-то услышал и уже приготовился к бою. Как раз вовремя, ведь звуки издавал ",
			"Бггггггггдррррым..дыщ..пыщ.. - услышал ты из-за кустов. Ого, какой здоровый ",
			"Ты заметил, как кто-то движется на тебя из темноты. Приглядевшись, ты понял, что это ",
			"Ты почувствовал чьё-то присутствие. Когда ты проверил за ближайшим деревом,<br>ты увидел, что это ",
			"Кто-то начал вылазить из под земли прямо перед тобой. Вот это да, какой здоровенный "
			];
			var monsterRnd = Math.floor(Math.random() * monsterMsg.length);
			writeConsole(monsterMsg[monsterRnd]+monsterName+"<br>"+monsterStats+"<br><br>Что будешь делать?<br><br><button onclick='fight(monster)'>Драться</button> <button onclick='run(monster)'>Попытаться убежать</button>");		
			break;
		case "Shop":
			var shopMsg = [
			"Ты встретил торговца на лошади. Он предложил тебе:<br><br>",
			"Ты увидел маленький дом неподалёку. Там ведьма продавала:<br><br>",
			"Проходя мимо деревушки, ты встретил людей, продающих:<br><br>",
			"Ты услышал крики ''Господин товарищ рыцарь!!'' сзади. Ты обернулся и увидел маленького мальчика. Он предложил тебе:<br><br>",
			"Ты заметил свору гоблинов, готовящих еду на костре. Они увидели тебя и предложили:<br><br>",
			"Загадочный чувак в капюшоне, проходящий мимо предложил тебе:<br><br>",
			"Ты встретил волшебника, торгующего своими пожитками. А именно:<br><br>",
			"Ты вошёл в небольшую деревню. Первым делом ты посетил магазин. Там было:<br><br>"
			];
			var shopRnd = Math.floor(Math.random() * shopMsg.length);
			writeConsole(shopMsg[shopRnd]+generateItems()+"<br>"+continueButton(true)+"<br>");		
			break;
		case "Treasure":
			actualTreasure = chance(1, 2);
			var treasureMsg = [
			"Ты споткнулся обо что-то твёрдое.<br>",
			"Ты увидел сияние в кустах.<br>",
			"Ты услышал странный звук и побежал на него.<br> Подбежав, ты заметил на земле какие-то предметы.<br>",
			"Что-то упало с неба прямо перед тобой.<br>",
			"Ты увидел труп, лежащий на дороге. <br>Справа от него сияли какие-то вещи.<br>",
			"Какой-то странный человек оставил на земле предметы, проходя мимо.<br> Ты подошёл посмотреть, что это.<br>"
			];
			var btns = "<br><button onclick='checkTreasure(1)'>Открыть первую коробку</button><br><br><button onclick='checkTreasure(2)'>Открыть вторую коробку</button><br>";
			var treasureRnd = Math.floor(Math.random() * treasureMsg.length);
			writeConsole(treasureMsg[treasureRnd]+" Оказалось, что это 2 одинаковые коробки и ключ.<br> Какую будем открывать?<br>"+btns);		
			break;
		case "Trap":
			var trapRnd = Math.floor(Math.random() * traps.length);
			if (chance(1,2) == 1){
			writeConsole(traps[trapRnd][0]+traps[trapRnd][1]+continueButton(true));					
			} else{
			var difHP = chance(1,7)+lvl;
			hp -= difHP;
			if (hp <= 0){
				writeConsole(traps[trapRnd][0]+traps[trapRnd][2]+" Ты потерял "+difHP+" HP.");
				addConsole("<br><b>Игра окончена - рыцарь погиб!</b><br><br><button onclick='document.location.reload();'>Выход</button>");
			} else{
				writeConsole(traps[trapRnd][0]+traps[trapRnd][2]+" Ты потерял "+difHP+" HP."+continueButton(true));
			}
			}	
			break;
		case "Exp":
		var expMin = 5 + lvl;
		var expMax = 20 + lvl;
		var addExp = chance(expMin, expMax);
		exp += addExp;
		var expMsg = [
		"Ты прочёл книгу и стал умнее. "+addExp+" очков опыта получено.<br>",
		"Яркий свет осветил твой путь. Пройдя по нему, ты получил "+addExp+" опыта.<br>",
		"Ты встретил умного путника. По пути вы обсудили политику,<br> стратегии боя и женщин. После того, как ваши пути разошлись, <br>ты получил "+addExp+" опыта.<br>",
		"Ты помог даме починить колесо её кареты. <br> Она подвезла тебя в знак благодарности. "+addExp+" опыта получено.<br>",
		"Ты увидел стаю собак, лающих на мальчика. Ты разогнал их<br> и отвёл мальчика домой. "+addExp+ " опыта получено.<br>",
		"Ты встретил старых друзей, пьющих вино у костра. <br> Ты просидел с ними до утра. "+addExp+" оптыа получено.<br>",
		"Внезапно ты понял, как строить путь по звёздам.<br> "+addExp+" оптыа получено.<br>",
		"Ты приготовил вкусный суп из грибов и ягод. <br>"+addExp+" опыта получено.<br>",
		"Ты встретил рыцаря. После приветствий он попросил тебя <br>попрактиковать с ним бой. Ты не отказался.<br>"+addExp+" опыта получено.<br>"
		];
		var expRnd = Math.floor(Math.random() * expMsg.length);
			writeConsole(expMsg[expRnd]+continueButton(true));	
			break;		
		//default:
	}
}
//If the hero has chosen to run from the monster
function run(monster){
	clearConsole();
	var loseExp = monster[1]*5 + 10
	exp -= loseExp;
	//checkExp();
		if (chance(1,2) == 1){
			writeConsole("Ты потерял "+loseExp+" опыта, но успешно убежал от монстра. "+continueButton(true));
			monster = [];
		} else{
			writeConsole("Ты потерял "+loseExp+" опыта, но к сожалению "+monster[0]+" догнал тебя.<br><br><button onclick='fight(monster)'>Драться</button>");
		}
	}
//If the hero has chosen to fight against the monster
function fight(monster){
	clearConsole();
	var firstTurn = true;
	var heroHits = false;
	var crit = 0;
	var missing = 0;
	var critDmg = 0;
	do {
		if (firstTurn == true){
			switch (chance(1,2)){
				case 1:
				heroHits = true;
				addConsole("На этот раз ты бьёшь первым!");
				break;
				case 2:
				heroHits = false;
				addConsole(""+monster[0]+" бьёт первым!");
				break;
			}
			firstTurn = false;
			addConsole("Твои HP: "+hp+", "+monster[0]+" HP: "+monster[3]);
		}
		if (heroHits == true){
			crit = chance(0,100);
			missing = chance(0,100);
			if (missing >= 25){
				if (crit <= 8+lvl){
				critDmg = dmg*3+dmg;
				monster[3] -= critDmg;
				if (monster[3] > 0){
					addConsole("Ты бьёшь монстрa критическим ударом! Урон: "+critDmg+"! "+monster[0]+" HP: "+monster[3]);
				} else {
					addConsole("Ты бьёшь монстра критическим ударом! Урон: "+critDmg+"! "+monster[0]+" погибает!");
				}
				} else{
				monster[3] -= dmg;	
					if (monster[3] > 0){
					addConsole("Ты бьёшь монстра! Урон: "+dmg+"! "+monster[0]+" HP: "+monster[3]);	
					}	else{
					addConsole("Ты бьёшь монстра! Урон: "+dmg+"! "+monster[0]+" погибает!");	
					}			
				}
			} else {
					addConsole("Ты промахиваешься! "+monster[0]+" HP: "+monster[3]);						
			}
			heroHits = false;
		} else{
			crit = chance(0,100);
			missing = chance(0,100);
			var defended = def;
			var totalDmg = 0;
			if (missing >= 35){
			if (crit <= 7+monster[1]){
				critDmg = monster[2]*2+monster[2];
				if (defended > critDmg){
					defended = critDmg;
				}
				totalDmg = critDmg - defended;
				hp -= totalDmg;
				if (hp > 0){
					addConsole(monster[0]+" бьёт тебя критическим ударом! Урон: "+critDmg+"! Твоя защита: "+def+", итоговый урон: "+totalDmg+". Твои HP: "+hp);
				} else {
					addConsole(monster[0]+" бьёт тебя критическим ударом! Урон: "+critDmg+"! Твоя защита: "+def+", итоговый урон: "+totalDmg+". Ты погибаешь!");
				}
				} else{
				if (defended > monster[2]){
					defended = monster[2];
				}
				totalDmg = monster[2] - defended;
				hp -= totalDmg;
					if (hp > 0){
					addConsole(monster[0]+" бьёт тебя! Урон: "+monster[2]+"! Твоя защита: "+def+", итоговый урон: "+totalDmg+". Твои HP: "+hp);	
					} else {
					addConsole(monster[0]+" бьёт тебя! Урон: "+monster[2]+"! Твоя защита: "+def+", итоговый урон: "+totalDmg+". Ты погибаешь!");						
					}
				}
			} else {
					addConsole(monster[0]+" промахивается! Твои HP: "+hp);						
			}
			heroHits = true;
		}
	}
	while (hp > 0 && monster[3] > 0);
	if (monster[3] <= 0){
		var difExp = monster[2]*2+15;
		var difMoney = monster[2]*2+chance(0,15);
		money += difMoney;
		exp += difExp;
		//checkExp();
		addConsole("Ты победил и получаешь "+difExp+" опыта. Кроме того ты нашёл "+difMoney+" Золота на земле."+continueButton(true));
	} else{
		addConsole("<b>Игра окончена - "+monster[0]+" убил тебя!</b><br><br><button onclick='document.location.reload();'>Выход</button>");
	}
}
//This function generates 1-4 shop items for each shop event
function generateItems(){
			var i = 0;
			var msg = "";
			for (i = 0; i < chance(1,4); i++){
				var itemId = chance(0,shopItems.length - 1);
				currentItem = shopItems[itemId];
				msg += "<button id='"+itemId+"' onclick = 'buy("+itemId+")'>"+currentItem[0]+" ("+currentItem[2]+" Золота) - "+currentItem[4]+"</button><br><br>";
			}
			return msg;
}
//This function checks if the hero has enough gold to buy an item and if so, applies its bonus
function buy(item){
	var chosenItem = shopItems[item];
	if (money >= chosenItem[2]){
		money -= chosenItem[2];
		var value = chosenItem[1];
		var bonus = chosenItem[3];
		switch (bonus){
			case "hp":
			hp += value;
			break;
			case "exp":
			exp += value;
			//checkExp();
			break;
			case "dmg":
			dmg += value;
			break;
			case "def":
			def += value;
			break;
		}
	var elem = document.getElementById(item);
	elem.parentNode.removeChild(elem);
	addConsole("Ты купил "+chosenItem[0]+" за "+chosenItem[2]+" Золота! Твои очки "+bonus+" были увеличены на "+value);
	} else{
		addConsole("<font color='red'><b>Недостаточно золота!</b></font>")
	}
}
//This function checks if the box hero opened contains something or not
function checkTreasure(boxId){
	if (boxId == actualTreasure){
		var item = shopItems[chance(0, shopItems.length-1)];
		var value = item[1];
		var bonus = item[3];
		switch (bonus){
			case "hp":
			hp += value;
			break;
			case "exp":
			exp += value;
			//checkExp();
			break;
			case "dmg":
			dmg += value;
			break;
			case "def":
			def += value;
			break;
		}
		clearConsole();
		writeConsole("<br>Ключ сломался при открытии этой коробки.<br> В коробке ты нашёл "+item[0]+"! Твои очки "+bonus+" были увеличены на "+value+"<br>"+continueButton(true));
	} else{
		clearConsole();
		writeConsole("<br>Ключ сломался при открытии этой коробки.<br>К сожалению, коробка оказалась пустой. Может быть повезёт в следующий раз!<br>"+continueButton(true));
	}
}

function gameOver(msg){
		clearConsole();
		writeConsole("<b>"+msg+"</b><br><br><button onclick='document.location.reload();'>Exit</button>");
}

function chance(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

//Functions to add text or clear the console field
function writeConsole(msg){
	return document.getElementById("console").innerHTML = msg
}
function clearConsole(){
	return document.getElementById("console").innerHTML =""
}
function addConsole(msg){
	var newLine = document.getElementById("console").innerHTML+"<br>"+msg;
	return document.getElementById("console").innerHTML = newLine
}
// This function checks if the hero hits the brick
function brickCollision() {
	for(c=0; c<brickColumnCount; c++) {
        	for(r=0; r<brickRowCount; r++) {
            		var b = bricks[c][r];
            			if(b.status == 1) {
					if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight)	{
						bricksLeft -= 1;
						if (bricksLeft == 0){
							princess = true;
						}
						hideHero();
						chooseEvent();
						b.status = 0;
				}
			}
		}
	}
}

//Draw functions
function drawHero(){
	ctx.beginPath();
	ctx.arc(x,y,heroRadius,0,2*Math.PI);
	ctx.fillStyle=heroColor;
	ctx.fillStroke=heroColor;
	ctx.Stroke="10";
	ctx.fill();
	ctx.closePath();
	}	
function hideHero(){
	tmpX = x;
	tmpY = y;
	x = -100;
	y = -100;
}
function showHero(){
	x = tmpX;
	y = tmpY;
}
//Checking functions
function checkHP(){
	if(hp < 0){
		hp = 0;
	}
}
function checkExp(){
	var hpDif = 0;
	var dmgDif = 0;
	var defDif = 0;
	if (exp < 0 && lvl != 0){
		lvl = 0;
		dmgDif = 2;
		dmg -= dmgDif;
		addConsole("<br>Твой уровень понижен до "+lvl+". Ты потерял "+dmgDif+" очка урона.");
	}
	if (exp >= 0 && exp <= 50 && lvl < 1){
		lvl = 1;
		hpDif = 10;
		dmgDif = 2;
		hp += hpDif;
		dmg += dmgDif;
		addConsole("<br>Твой уровень был повышен до "+lvl+". Ты получил "+hpDif+" HP и "+dmgDif+" очка урона.");		
	}
	if (exp >= 0 && exp <= 50 && lvl > 1){
		lvl = 1;
		dmgDif = 3;
		dmg -= dmgDif;
		addConsole("<br>Твой уровень понижен до "+lvl+". Ты потерял "+dmgDif+" очка урона.");		
	}
	if (exp >= 51 && exp <= 100 && lvl < 2){
		lvl = 2;
		hpDif = 15;
		dmgDif = 3;
		hp += hpDif;
		dmg += dmgDif;
		addConsole("<br>Твой уровень был повышен до "+lvl+". Ты получил "+hpDif+" HP и "+dmgDif+" очка урона.");		
	}
	if (exp >= 51 && exp <= 100 && lvl > 2){
		lvl = 2;
		dmgDif = 4;
		dmg -= dmgDif;
		addConsole("<br>Твой уровень понижен до "+lvl+". Ты потерял "+dmgDif+" очка урона.");		
	}
	if (exp >= 101 && exp <= 150 && lvl < 3){
		lvl = 3;
		hpDif = 20;
		dmgDif = 4;
		hp += hpDif;
		dmg += dmgDif;
		addConsole("<br>Твой уровень был повышен до "+lvl+". Ты получил "+hpDif+" HP и "+dmgDif+" очка урона.");		
	}
	if (exp >= 101 && exp <= 150 && lvl > 3){
		lvl = 3;
		dmgDif = 5;
		dmg -= dmgDif;
		defDif = 1;
		def -= defDif;
		addConsole("<br>Твой уровень понижен до "+lvl+". Ты потерял "+dmgDif+" очков урона и "+defDif+" очко защиты.");		
	}
	if (exp >= 151 && exp <= 200 && lvl < 4){
		lvl = 4;
		hpDif = 25;
		dmgDif = 5;
		defDif = 1;
		hp += hpDif;
		dmg += dmgDif;
		def += defDif;
		addConsole("<br>Твой уровень был повышен до "+lvl+". Ты получил "+hpDif+" HP, "+dmgDif+" очков урона и "+defDif+" очко защиты");		
	}
	if (exp >= 151 && exp <= 200 && lvl > 4){
		lvl = 4;
		dmgDif = 6;
		dmg -= dmgDif;
		defDif = 2;
		def -= defDif;
		addConsole("<br>Твой уровень понижен до "+lvl+". Ты потерял "+dmgDif+" очков урона и "+defDif+" очка защиты.");		
	}
	if (exp >= 251 && exp <= 350 && lvl < 5){
		lvl = 5;
		hpDif = 30;
		dmgDif = 6;
		defDif = 2;
		hp += hpDif;
		dmg += dmgDif;
		def += defDif;
		addConsole("<br>Твой уровень был повышен до "+lvl+". Ты получил "+hpDif+" HP, "+dmgDif+" очков урона и "+defDif+" очка защиты.");		
	}
	if (exp >= 251 && exp <= 350 && lvl > 5){
		lvl = 5;
		dmgDif = 7;
		dmg -= dmgDif;
		defDif = 3;
		def -= defDif;
		addConsole("<br>Твой уровень понижен до "+lvl+". Ты потерял "+dmgDif+" очков урона и "+defDif+" очка защиты.");		
	}
	if (exp > 350 && lvl != 6){
		lvl = 6;
		hpDif = 35;
		dmgDif = 7;
		defDif = 3;
		hp += hpDif;
		dmg += dmgDif;
		def += defDif;
		addConsole("<br>Твой уровень был повышен до "+lvl+". Ты получил "+hpDif+" HP, "+dmgDif+" очков урона и "+defDif+" очка защиты.");			
	}
}

function drawBricks() {
    for(c=0; c<brickColumnCount; c++) {
        for(r=0; r<brickRowCount; r++) {
            if(bricks[c][r].status == 1) {
                var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
                var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = brickColor;
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}
//The main draw function
function draw(){
	ctx.clearRect(0,0,canvas.width,canvas.height);
	drawBricks();
	drawHero();
	drawStats();	
	brickCollision();
	checkHP();
	checkExp();
	if(rightPressed && x<canvas.width-heroRadius){		
		x+=speed;
		}
	else if(leftPressed && x>0+heroRadius){
		 x-=speed;		 
		 }
	else if(upPressed && y>0+heroRadius+25){
		 y-=speed;		 
		 }
	else if(downPressed && y<canvas.height-heroRadius){
		 y+=speed;		 
		 }
	requestAnimationFrame(draw);
}

function drawStats() {
    ctx.font = "14px Arial";
    ctx.fillStyle = "#000000";
    ctx.fillText("Уровень: "+lvl+"; Опыт: "+exp+"; HP: "+hp+"; Урон: "+dmg+"; Защита: "+def+"; Золото: "+money, 8, 20);
}

function startGame(){
	var elem = document.getElementById("begin");
	elem.parentNode.removeChild(elem);
	if (document.getElementById("help")){
	elem = document.getElementById("help");
	elem.parentNode.removeChild(elem);	
	}
	writeConsole("Ты стоишь у входа в глубокий лес. <br>Где-то в нём твоя возлюбленная принцесса.<br> Помни, что в лесу много тайн.<br> Удачи и будь осторожен!");
	draw();
}
function showHelp(){
	var elem = document.getElementById("help");
	elem.parentNode.removeChild(elem);
	writeConsole("Ты играешь за рыцаря, который ищет принцессу в лесу. <br>Используй стрелки клавиатуры, чтобы двигаться и найти её!<br> В лесу есть монстры, сокровища, ловушки, магазины и много чего ещё.<br> В магазинах ты можешь купить предметы, дающие тебе бонусы. <br> Ты можешь сражаться с монстрами, или убегать от них, чтобы избежать поражения,<br> но учти, что ты потеряешь опыт в случае побега.<br>Лут с монстра зависит от его уровня и твоей удачи.<br><br><b>Успехов, рыцарь! Иди, найди принцессу!</b>");
}