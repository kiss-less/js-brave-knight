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
["A huge bear noticed you and ran in your direction very fast. <br>","Luckly you were able to hide in the nearest bushes.","He did it so quickly that you were able to hide only after his punch in your face.<br>"],
["You didn't notice a huge hole under your feet...<br>"," When you was almost falling into it, you managed to <br>grip the ground at the very last moment."," You felt down. The hole was very deep.<br>"],
["Giant flock of wasps flew in your direction.<br>","You quickly lied on the ground and hid yourself as accurate as you could.","You started running to the opposite direction, but smashed into the tree.<br>"],
["A troop of wolves started to get around you.<br>","You recalled about a roasted peace of meat in your bag.<br> You dropped meat to them and quickly walked away.","You wanted to feed them, but didn't have anything. They attacked you.<br>"],
["You found a bottle with a strange colored liquid inside.<br>","You poured some liquid to the ground before drinking it<br> and it was a good decision - ground was covered by fire.","You were so thirsty that decided to drink it immideately. <br>The liquid burned your mouth.<br>"],
["A giant spider was wandering around you.<br>","You lied on the ground without any movement, and the spider left you there.","You started getting down slowly, but the spider attacked you.<br>"],
["You heard a woman's voice calling for help from the lake near you.<br>","You jumped to the lake and saved the lady.","You jumped to the lake, but there was no woman in it.<br> Only a Chimera who attacked you."],
["A storm begins and you noticed a house in front of you. <br>","You quickly ran to the house and a charming lady let you in <br> to wait till the storm will be finished.","But you were not quick enough to be there <br> before the storm catched you up<br>"]
];
//Shop items array - the name, bonus value, price, stat to improve, description
shopItems = [
["Small healing potion", 10, 10, "hp", "Restores a small amount of your HP"],
["Medium healing potion", 15, 15, "hp", "Restores a medium amount of your HP"],
["Big healing potion", 30, 30, "hp", "Restores a high amount of your HP"],
["Small book", 10, 5, "exp", "Provides you with a little amount of experience"],
["Medium book", 20, 10, "exp", "Provides you with a medium amount of experience"],
["Big book", 40, 20, "exp", "Provides you with a huge amount of experience"],
["Leather armor", 3, 10, "def", "Gives you additional defence points"],		
["Wooden armor", 5, 20, "def", "Gives you additional defence points"],	
["Iron armor", 7, 40, "def", "Gives you additional defence points"],	
["Steel armor", 10, 60, "def", "Gives you additional defence points"],			
["Small axe", 3, 10, "dmg", "Gives you additional damage points"],	
["Medium axe", 5, 20, "dmg", "Gives you additional damage points"],
["Big axe", 7, 30, "dmg", "Gives you additional damage points"]					
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
		gameOver("Congratulations! You found a princess!");
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
		return "<br><br><button onclick='showHero();clearConsole();'>Continue</button>";
	} else {
		return "<br><br><button onclick='clearConsole();'>Continue</button>";
	}
}
// Event generating functions
function generateEvent(name){
	switch (name) {
		case "Empty":
			var emptyMsg = [
			"You heard something and already prepared your sharp blade.<br>But it was only a wind blowing leaves from the tree in front of you...", 
			"Voices in your head confused you. You looked around carefully.<br>There was no one here this time...",
			"Ffffkrrrrshhzzzwooooom..woom..woooom.. - heard you from the bushes.<br> You slowly touched the bushes by your sword, but found<br> only a rabbit, peacefully eating something.",
			"What is that horrible smell? You went closer to the hole in<br>the ground to check. Ok, it is just a someone's body. Probably <br>missed the trap. Poor guy.",
			"A ZOMBIE! You started to swing it with your sward, but realized<br>that it is just your hallucination. Hmm, you shouldn't have<br>eaten those mushrooms.",
			"You saw a blood trace on the ground and followed it. But suddenly <br> it just disappeared in the middle of the way. Strange...",
			"You were passing deep bushes, when heard silent steps behind. <br>You turned around, prepared to fight, but saw<br>only a little fox, heading you.",
			"Nothing here. Well, let's consider it as good news.",
			"You noticed a few black shadows on the ground. Silently you got<br> closer to take a look at these strangers.<br>But it turned out it were 2 lonely swaying trees.",
			"You felt someone's presence nearby. When you checked the nearest<br>tree, a few squirrels quickly ran away.",
			"You smelled something unusual, but when came closer to check<br>it turned out that someone just forgot to put out the fire."
			];
			var emptyRnd = Math.floor(Math.random() * emptyMsg.length);
			writeConsole(emptyMsg[emptyRnd]+continueButton(true));
			break;
		case "Monster":
			var monsterNames = ["Zombie", "Werewolf", "Boffalo", "Ghost", "Bear", "Hydra", "Cyclops", "Chimera", "Sphinx", "Venom", "Vampire", "Dog", "Dark Knight", "Ghool", "Dwarf", "Wizard", "Ninja", "Dead Girl", "Troll"];
			var monsterName = monsterNames[Math.floor(Math.random() * monsterNames.length)];
			var monsterLvl = Math.floor(Math.random() * 6) + 1;
			var monsterDmg = monsterLvl * 3;
			var monsterHp = monsterLvl * 5 + 25;
			monster = [monsterName, monsterLvl, monsterDmg, monsterHp];
			var monsterStats = monster[0]+" level "+monster[1]+". Dmg: "+monster[2]+", HP: "+monster[3];
			var monsterMsg = [
			"Wooow, there is a monster heading to you from the bushes: it is a ",
			"Someone touched your shoulder. You turned around and saw a ",
			"Something fell from the tree right in front of you. Oh my god! This is a ",
			"You heard a deep roar from the left side of tree. It was a ",
			"A stone flew near your head. You turned around to see, who dropped it and saw a ",
			"You saw something jumped at you. Fortunately you managed to avoid it. It was a ",
			"You heard something and already prepared your sharp blade. About time! It was a ",
			"Ffffkrrrrshhzzzwooooom..woom..woooom.. - heard you from the bushes. Wow! What a huge ",
			"You saw something running on you from the darkness. After a closer glance you realized that it is a ",
			"You felt someone's presence nearby. When you checked the nearest tree you saw a ",
			"You saw something literally growing from the ground. It was a "
			];
			var monsterRnd = Math.floor(Math.random() * monsterMsg.length);
			writeConsole(monsterMsg[monsterRnd]+monsterName+"<br>"+monsterStats+"<br><br>What are you going to do?<br><br><button onclick='fight(monster)'>Fight with the "+monsterName+"</button> <button onclick='run(monster)'>Try to run away</button>");		
			break;
		case "Shop":
			var shopMsg = [
			"You met a trader on a horse passing by. Here is what he can sell you:<br><br>",
			"You saw a small house nearby. It turned out it is a local witch, selling stuff:<br><br>",
			"You are passing through the village. There are people selling these:<br><br>",
			"You heard ''Mister! MISTER!!'' from behind. You turned around and saw a little boy. He offered you:<br><br>",
			"You noticed a sworn of goblins preparing some food on fire. They saw you and offered to buy from them:<br><br>",
			"The mistery person appeared from nowhere and suggested you:<br><br>",
			"You met a wizard, who was selling his belongings. Here is what he had:<br><br>",
			"You came to a small village and the first thing you checked was a local shop:<br><br>"
			];
			var shopRnd = Math.floor(Math.random() * shopMsg.length);
			writeConsole(shopMsg[shopRnd]+generateItems()+"<br>"+continueButton(true)+"<br>");		
			break;
		case "Treasure":
			actualTreasure = chance(1, 2);
			var treasureMsg = [
			"You stumbled upon something hard.<br>",
			"You saw bright shining from the bushes.<br>",
			"You heard some noise and ran to check what's going on.<br> You got closer and saw something bright on a groud.<br>",
			"Something smashed to the ground right from the sky near you.<br>",
			"You saw a dead body right on your way. <br>On the right sight of which there was shining.<br>You came closer to check.<br>",
			"Some mystery person passed by and left something on the ground.<br> You took a closer look at it.<br>"
			];
			var btns = "<br><button onclick='checkTreasure(1)'>Open the first box</button><br><br><button onclick='checkTreasure(2)'>Open the second box</button><br>";
			var treasureRnd = Math.floor(Math.random() * treasureMsg.length);
			writeConsole(treasureMsg[treasureRnd]+" There were 2 equal golden boxes and a key.<br> Please choose which one to open:<br>"+btns);		
			break;
		case "Trap":
			var trapRnd = Math.floor(Math.random() * traps.length);
			if (chance(1,2) == 1){
			writeConsole(traps[trapRnd][0]+traps[trapRnd][1]+continueButton(true));					
			} else{
			var difHP = chance(1,7)+lvl;
			hp -= difHP;
			if (hp <= 0){
				writeConsole(traps[trapRnd][0]+traps[trapRnd][2]+" You lost "+difHP+" HP.");
				addConsole("<br><b>Game over - You died!</b><br><br><button onclick='document.location.reload();'>Exit</button>");
			} else{
				writeConsole(traps[trapRnd][0]+traps[trapRnd][2]+" You lost "+difHP+" HP."+continueButton(true));
			}
			}	
			break;
		case "Exp":
		var expMin = 5 + lvl;
		var expMax = 20 + lvl;
		var addExp = chance(expMin, expMax);
		exp += addExp;
		var expMsg = [
		"You found a book and after reading it you felt smarter. "+addExp+" exp points granted.<br>",
		"A bright light shown you the way. You decided to follow it <br>and after it disappeared, you obtained "+addExp+" exp points.<br>",
		"You met a very smart guy on your way. You discussed politics,<br> war strategies and women until your ways were in the <br>same direction. "+addExp+" exp points added.<br>",
		"You helped some lady to fix the wheel of her carriage. <br> She promised to give you a ride in return. "+addExp+" exp points received.<br>",
		"You saw a bulk of dogs barking at a little boy. You scattered them.<br> Then you picked up the child and returned him home. "+addExp+ " exp points granted.<br>",
		"You met your friends drinking wine, eating and telling stories. <br> You stayed with them for the whole night. "+addExp+" exp points received.<br>",
		"You suddenly understood how to find your way using the night sky.<br> "+addExp+" exp points obtained.<br>",
		"You used berries and mushrooms to prepare a very tasty soup. <br>"+addExp+" exp points received.<br>",
		"You met the other knight on your way. After warm welcome he <br>asked you to practice his sword fighting. You accepter the offer.<br>"+addExp+" exp points granted.<br>"
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
			writeConsole("You lost "+loseExp+" exp, but successfully ran out of the "+monster[0]+". "+continueButton(true));
			monster = [];
		} else{
			writeConsole("You lost "+loseExp+" exp, but unfortunately the "+monster[0]+" managed to catch you up.<br><br><button onclick='fight(monster)'>Fight with the "+monster[0]+"</button>");
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
				addConsole("The first turn is yours this time!");
				break;
				case 2:
				heroHits = false;
				addConsole("The "+monster[0]+" hits you first!");
				break;
			}
			firstTurn = false;
			addConsole("Your HP: "+hp+", "+monster[0]+" HP: "+monster[3]);
		}
		if (heroHits == true){
			crit = chance(0,100);
			missing = chance(0,100);
			if (missing >= 25){
				if (crit <= 8+lvl){
				critDmg = dmg*3+dmg;
				monster[3] -= critDmg;
				if (monster[3] > 0){
					addConsole("You hit the "+monster[0]+" with a critical hit! Dmg: "+critDmg+"! The "+monster[0]+" HP: "+monster[3]);
				} else {
					addConsole("You hit the "+monster[0]+" with a critical hit! Dmg: "+critDmg+"! The "+monster[0]+" dies!");
				}
				} else{
				monster[3] -= dmg;	
					if (monster[3] > 0){
					addConsole("You hit the "+monster[0]+"! Dmg: "+dmg+"! The "+monster[0]+" HP: "+monster[3]);	
					}	else{
					addConsole("You hit the "+monster[0]+"! Dmg: "+dmg+"! The "+monster[0]+" dies!");	
					}			
				}
			} else {
					addConsole("You miss! The "+monster[0]+" HP: "+monster[3]);						
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
					addConsole("The "+monster[0]+" hits you with a critical hit! Dmg: "+critDmg+"! Your def is "+def+", so total dmg is "+totalDmg+". Your HP: "+hp);
				} else {
					addConsole("The "+monster[0]+" hits you with a critical hit! Dmg: "+critDmg+"! Your def is "+def+", so total dmg is "+totalDmg+". This hit kills you!");
				}
				} else{
				if (defended > monster[2]){
					defended = monster[2];
				}
				totalDmg = monster[2] - defended;
				hp -= totalDmg;
					if (hp > 0){
					addConsole("The "+monster[0]+" hits you! Dmg: "+monster[2]+"! Your def is "+def+", so total dmg is "+totalDmg+". Your HP: "+hp);	
					} else {
					addConsole("The "+monster[0]+" hits you! Dmg: "+monster[2]+"! Your def is "+def+", so total dmg is "+totalDmg+". This hit kills you!");						
					}
				}
			} else {
					addConsole("The "+monster[0]+" misses! Your HP: "+hp);						
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
		addConsole("You won and gained "+difExp+" exp. Also you found "+difMoney+" Gold on the ground."+continueButton(true));
	} else{
		addConsole("<b>Game over - the "+monster[0]+" killed you!</b><br><br><button onclick='document.location.reload();'>Exit</button>");
	}
}
//This function generates 1-4 shop items for each shop event
function generateItems(){
			var i = 0;
			var msg = "";
			for (i = 0; i < chance(1,4); i++){
				var itemId = chance(0,shopItems.length - 1);
				currentItem = shopItems[itemId];
				msg += "<button id='"+itemId+"' onclick = 'buy("+itemId+")'>"+currentItem[0]+" ("+currentItem[2]+" Gold) - "+currentItem[4]+"</button><br><br>";
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
	addConsole("You bougth a "+chosenItem[0]+" for "+chosenItem[2]+" Gold! Your "+bonus+" has been increased by "+value);
	} else{
		addConsole("<font color='red'><b>You don't have enough Gold!</b></font>")
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
		writeConsole("<br>The key was broken right after you opened the box.<br> In the box you found a "+item[0]+"! Your "+bonus+" has been increased by "+value+"<br>"+continueButton(true));
	} else{
		clearConsole();
		writeConsole("<br>The key was broken right after you opened the box.<br>Unfortunately the box you chose was empty! Maybe next time!<br>"+continueButton(true));
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
		addConsole("<br>Your level has been decreased to "+lvl+". You lost "+dmgDif+" dmg points.");
	}
	if (exp >= 0 && exp <= 50 && lvl < 1){
		lvl = 1;
		hpDif = 10;
		dmgDif = 2;
		hp += hpDif;
		dmg += dmgDif;
		addConsole("<br>Your level has been increased to "+lvl+". You received "+hpDif+" HP and "+dmgDif+" dmg points.");		
	}
	if (exp >= 0 && exp <= 50 && lvl > 1){
		lvl = 1;
		dmgDif = 3;
		dmg -= dmgDif;
		addConsole("<br>Your level has been decreased to "+lvl+". You lost "+dmgDif+" dmg points.");		
	}
	if (exp >= 51 && exp <= 100 && lvl < 2){
		lvl = 2;
		hpDif = 15;
		dmgDif = 3;
		hp += hpDif;
		dmg += dmgDif;
		addConsole("<br>Your level has been increased to "+lvl+". You received "+hpDif+" HP and "+dmgDif+" dmg points.");		
	}
	if (exp >= 51 && exp <= 100 && lvl > 2){
		lvl = 2;
		dmgDif = 4;
		dmg -= dmgDif;
		addConsole("<br>Your level has been decreased to "+lvl+". You lost "+dmgDif+" dmg points.");		
	}
	if (exp >= 101 && exp <= 150 && lvl < 3){
		lvl = 3;
		hpDif = 20;
		dmgDif = 4;
		hp += hpDif;
		dmg += dmgDif;
		addConsole("<br>Your level has been increased to "+lvl+". You received "+hpDif+" HP and "+dmgDif+" dmg points.");		
	}
	if (exp >= 101 && exp <= 150 && lvl > 3){
		lvl = 3;
		dmgDif = 5;
		dmg -= dmgDif;
		defDif = 1;
		def -= defDif;
		addConsole("<br>Your level has been decreased to "+lvl+". You lost "+dmgDif+" dmg points and "+defDif+" def points.");		
	}
	if (exp >= 151 && exp <= 200 && lvl < 4){
		lvl = 4;
		hpDif = 25;
		dmgDif = 5;
		defDif = 1;
		hp += hpDif;
		dmg += dmgDif;
		def += defDif;
		addConsole("<br>Your level has been increased to "+lvl+". You received "+hpDif+" HP, "+dmgDif+" dmg points and "+defDif+" def points");		
	}
	if (exp >= 151 && exp <= 200 && lvl > 4){
		lvl = 4;
		dmgDif = 6;
		dmg -= dmgDif;
		defDif = 2;
		def -= defDif;
		addConsole("<br>Your level has been decreased to "+lvl+". You lost "+dmgDif+" dmg points and "+defDif+" def points.");		
	}
	if (exp >= 251 && exp <= 350 && lvl < 5){
		lvl = 5;
		hpDif = 30;
		dmgDif = 6;
		defDif = 2;
		hp += hpDif;
		dmg += dmgDif;
		def += defDif;
		addConsole("<br>Your level has been increased to "+lvl+". You received "+hpDif+" HP, "+dmgDif+" dmg points and "+defDif+" def points");		
	}
	if (exp >= 251 && exp <= 350 && lvl > 5){
		lvl = 5;
		dmgDif = 7;
		dmg -= dmgDif;
		defDif = 3;
		def -= defDif;
		addConsole("<br>Your level has been decreased to "+lvl+". You lost "+dmgDif+" dmg points and "+defDif+" def points.");		
	}
	if (exp > 350 && lvl != 6){
		lvl = 6;
		hpDif = 35;
		dmgDif = 7;
		defDif = 3;
		hp += hpDif;
		dmg += dmgDif;
		def += defDif;
		addConsole("<br>Your level has been increased to "+lvl+". You received "+hpDif+" HP, "+dmgDif+" dmg points and "+defDif+" def points");			
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
    ctx.fillText("Hero Level: "+lvl+"; Exp: "+exp+"; HP: "+hp+"; Dmg: "+dmg+"; Def: "+def+"; Gold: "+money, 8, 20);
}

function startGame(){
	var elem = document.getElementById("begin");
	elem.parentNode.removeChild(elem);
	if (document.getElementById("help")){
	elem = document.getElementById("help");
	elem.parentNode.removeChild(elem);	
	}
	writeConsole("You are staying in front of the entrence to a deep forest. <br>Somewhere within it there is your beloved princess.<br> But bear in mind that this forest contains many secrets.<br> Be careful and good luck!");
	draw();
}
function showHelp(){
	var elem = document.getElementById("help");
	elem.parentNode.removeChild(elem);
	writeConsole("You playing as a knight who is looking for a princess within a deep forest. <br>Use the keyboard arrow keys to navigate through it and find her!<br> This forest contains monsters, shops, traps, treasures and more random events.<br> In shops you can buy items which will gain you some bonus instantly. <br> You should fight with monsters, or try to run away if you decide to avoid the fight,<br> but beware that your experience will be decreased even if you ran away successfully.<br>The loot you gain in case of win depends on monster's level and your luck (actual one ;)).<br><br><b>Good luck Brave Knight! Go get her!</b>");
}